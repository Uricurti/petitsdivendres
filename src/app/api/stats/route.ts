import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/insforge';

export async function GET() {
  try {
    const supabase = getAdminClient();

    // 1. Darrer divendres tancat o obert
    const { data: lastSessions } = await supabase.database.from('sessions')
      .select('date, current_count, is_open, opened_at, closed_at')
      .order('date', { ascending: false })
      .limit(2);

    // Agafem el divendres recent que NO sigui el d'avui si està obert, o el darrer tancat.
    let lastFriday = lastSessions && lastSessions.length > 0 ? lastSessions[0] : null;
    if (lastFriday && lastFriday.is_open && lastSessions && lastSessions.length > 1) {
      lastFriday = lastSessions[1];
    }

    // 2. Històric
    const { data: history } = await supabase.database.from('sessions')
      .select('date, current_count, is_open')
      .order('date', { ascending: false })
      .limit(6);

    // 3. Nens freqüents i Trams Horaris
    const { data: attendances } = await supabase.database.from('attendances')
      .select('child_id, check_in_time, check_out_time, children(name)');
      
    const freqMap: Record<string, {name: string, count: number}> = {};
    const hourCounts: Record<string, number> = {};
    let totalDurationMinutes = 0;
    let finishedSessions = 0;

    if (attendances) {
      attendances.forEach((a: any) => {
        const childName = Array.isArray(a.children) ? a.children[0]?.name : a.children?.name;
        if (childName) {
          if (!freqMap[a.child_id]) freqMap[a.child_id] = { name: childName, count: 0 };
          freqMap[a.child_id].count++;
        }

        // Hora punta
        if (a.check_in_time) {
          const inTime = new Date(a.check_in_time);
          const hour = inTime.getHours();
          const hourLabel = `${hour}:00h - ${hour+1}:00h`;
          hourCounts[hourLabel] = (hourCounts[hourLabel] || 0) + 1;
        }

        // Durada de l'estància
        if (a.check_in_time && a.check_out_time) {
          const inTime = new Date(a.check_in_time);
          const outTime = new Date(a.check_out_time);
          const diffMs = outTime.getTime() - inTime.getTime();
          totalDurationMinutes += diffMs / 60000;
          finishedSessions++;
        }
      });
    }

    const frequentChildren = Object.values(freqMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0] || null;
    const avgDuration = finishedSessions > 0 ? Math.round(totalDurationMinutes / finishedSessions) : 0;

    return NextResponse.json({
      lastFriday,
      history: history || [],
      frequentChildren,
      peakHour,
      avgDuration,
      totalChildrenUnique: Object.keys(freqMap).length
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
