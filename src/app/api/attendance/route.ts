import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/insforge';

export async function GET() {
  const supabase = getAdminClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: session } = await supabase.database.from('sessions').select('id').eq('date', today).single();
  if (!session) return NextResponse.json({ attendances: [] });

  const { data, error } = await supabase.database
    .from('attendances')
    .select('id, check_in_time, children(id, name)')
    .eq('session_id', session.id)
    .is('check_out_time', null)
    .order('check_in_time', { ascending: false });
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ attendances: data });
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || name.trim() === '') return NextResponse.json({ error: 'Nom requerit' }, { status: 400 });
    const cleanName = name.trim();

    const supabase = getAdminClient();
    const today = new Date().toISOString().split('T')[0];

    const { data: session } = await supabase.database.from('sessions').select('*').eq('date', today).single();
    if (!session || !session.is_open) return NextResponse.json({ error: 'Sessió tancada' }, { status: 400 });
    if (session.current_count >= session.max_capacity) return NextResponse.json({ error: 'Aforament complet' }, { status: 400 });

    let childId;
    const { data: existingChild } = await supabase.database.from('children')
      .select('id')
      .ilike('name', cleanName)
      .limit(1)
      .single();

    if (existingChild) {
      childId = existingChild.id;
    } else {
      const { data: newChild, error: childErr } = await supabase.database.from('children')
        .insert([{ name: cleanName }])
        .select()
        .single();
      if (childErr) throw childErr;
      childId = newChild.id;
    }

    const { data: activeAtt } = await supabase.database.from('attendances')
      .select('id')
      .eq('session_id', session.id)
      .eq('child_id', childId)
      .is('check_out_time', null)
      .limit(1)
      .single();

    if (activeAtt) return NextResponse.json({ error: "Aquest nen ja està dins l'espai" }, { status: 400 });

    const { error: attErr } = await supabase.database.from('attendances')
      .insert([{ session_id: session.id, child_id: childId }]);
    if (attErr) throw attErr;

    const { count, error: countErr } = await supabase.database.from('attendances')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', session.id)
      .is('check_out_time', null);
      
    if (countErr) throw countErr;
    const newCount = count || 0;

    await supabase.database.from('sessions')
      .update({ current_count: newCount, updated_at: new Date().toISOString() })
      .eq('id', session.id);

    await supabase.database.from('capacity_log').insert([{
      session_id: session.id,
      event_type: 'family_in_named',
      count_before: session.current_count,
      count_after: newCount
    }]);

    return NextResponse.json({ success: true, newCount });
  } catch (err: any) {
    if (err.code === 'PGRST116') return NextResponse.json({ error: 'Sense dades' }, { status: 404 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { attendance_id } = await request.json();
    const supabase = getAdminClient();
    
    // Hem d'evitar usar .single() en select sense ID directe o si falten registres.
    const { data: att } = await supabase.database.from('attendances').select('session_id').eq('id', attendance_id).single();
    if (!att) return NextResponse.json({ error: 'Registre no trobat' }, { status: 404 });

    const { data: session } = await supabase.database.from('sessions').select('*').eq('id', att.session_id).single();
    if (!session) return NextResponse.json({ error: 'Sessió no trobada' }, { status: 404 });

    const { error: outErr } = await supabase.database.from('attendances')
      .update({ check_out_time: new Date().toISOString() })
      .eq('id', attendance_id);
      
    if (outErr) throw outErr;

    const { count, error: countErr } = await supabase.database.from('attendances')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', session.id)
      .is('check_out_time', null);

    if (countErr) throw countErr;
    const newCount = count || 0;

    await supabase.database.from('sessions')
      .update({ current_count: newCount, updated_at: new Date().toISOString() })
      .eq('id', session.id);

    await supabase.database.from('capacity_log').insert([{
      session_id: session.id,
      event_type: 'family_out_named',
      count_before: session.current_count,
      count_after: newCount
    }]);

    return NextResponse.json({ success: true, newCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
