import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/insforge';

export async function GET() {
  const supabase = getAdminClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase.database
    .from('sessions')
    .select('*')
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data || null });
}

export async function POST(request: Request) {
  const { action } = await request.json(); // 'open' | 'close'
  const supabase = getAdminClient();
  const today = new Date().toISOString().split('T')[0];

  try {
    if (action === 'open') {
      const { data, error } = await supabase.database
        .from('sessions')
        .upsert(
          [{ 
            date: today, 
            is_open: true, 
            opened_at: new Date().toISOString(),
            current_count: 0,
            max_capacity: 20
          }], 
          { onConflict: 'date' }
        )
        .select()
        .single();
      
      if (error) throw error;
      
      await supabase.database.from('capacity_log').insert([{
        session_id: data.id,
        event_type: 'session_open',
        count_before: 0,
        count_after: 0
      }]);

      return NextResponse.json({ session: data });
    } else if (action === 'close') {
      const { data: session } = await supabase.database.from('sessions').select('*').eq('date', today).single();
      if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      // 1. Marcar la sortida de tots els nens que encara estiguin dins
      await supabase.database
        .from('attendance')
        .update({ checked_out_at: new Date().toISOString() })
        .eq('session_id', session.id)
        .is('checked_out_at', null);

      // 2. Tancar sessió i posar el comptador a zero
      const { data, error } = await supabase.database
        .from('sessions')
        .update({ 
          is_open: false, 
          closed_at: new Date().toISOString(),
          current_count: 0 
        })
        .eq('id', session.id)
        .select()
        .single();
      
      if (error) throw error;

      await supabase.database.from('capacity_log').insert([{
        session_id: session.id,
        event_type: 'session_close',
        count_before: session.current_count,
        count_after: 0
      }]);

      return NextResponse.json({ session: data });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
