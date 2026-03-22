import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/insforge';

export async function GET() {
  const supabase = getAdminClient();
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data: session } = await supabase.database
      .from('sessions')
      .select('*')
      .eq('date', today)
      .single();

    let peakMinutes = 0;
    let hourlyFlow: { time: string; amount: number }[] = [
      { time: '16:00', amount: 0 },
      { time: '17:00', amount: 0 },
      { time: '18:00', amount: 0 },
      { time: '19:00', amount: 0 },
      { time: '20:00', amount: 0 },
    ];

    if (session) {
      // 1. Hourly Flow Heatmap
      const { data: attendances } = await supabase.database
        .from('attendances')
        .select('check_in_time')
        .eq('session_id', session.id);

      if (attendances && attendances.length > 0) {
        const counts = new Array(24).fill(0);
        attendances.forEach((att: any) => {
          const dt = new Date(att.check_in_time);
          counts[dt.getHours()]++;
        });

        hourlyFlow = [];
        for (let i = 16; i <= 20; i++) {
          hourlyFlow.push({ time: `${i}:00`, amount: counts[i] });
        }
      }

      // 2. Critical Peak Minutes
      const { data: logs } = await supabase.database
        .from('capacity_log')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (logs && logs.length > 0) {
        let criticalStart: Date | null = null;
        let lastCount = 0;
        
        logs.forEach((log: any) => {
          if (log.count_after >= session.max_capacity && lastCount < session.max_capacity) {
            criticalStart = new Date(log.created_at);
          } else if (log.count_after < session.max_capacity && criticalStart) {
            const end = new Date(log.created_at);
            peakMinutes += Math.round((end.getTime() - (criticalStart as Date).getTime()) / 60000);
            criticalStart = null;
          }
          lastCount = log.count_after;
        });

        if (criticalStart) {
          peakMinutes += Math.round((new Date().getTime() - (criticalStart as Date).getTime()) / 60000);
        }
      }
    }

    // 3. Loyal Families VIP
    const { data: allAtts } = await supabase.database
      .from('attendances')
      .select('child_id, children(name)');

    let loyalFamilies: any[] = [];
    if (allAtts) {
      const counts: Record<string, {name: string, count: number}> = {};
      allAtts.forEach((a: any) => {
        if (!a.children) return;
        const id = a.child_id;
        // Cast to any since postgrest JS returns object | array automatically 
        const childObj: any = Array.isArray(a.children) ? a.children[0] : a.children;
        if (!childObj) return;

        if (!counts[id]) counts[id] = { name: childObj.name, count: 0 };
        counts[id].count++;
      });
      loyalFamilies = Object.values(counts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    return NextResponse.json({
      hourlyFlow,
      peakMinutes,
      loyalFamilies
    });
  } catch (err: any) {
    if (err.code === 'PGRST116') return NextResponse.json({ hourlyFlow: [], peakMinutes: 0, loyalFamilies: [] });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
