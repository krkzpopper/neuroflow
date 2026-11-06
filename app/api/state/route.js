import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('aegis_state')
      .select('*')
      .eq('id', 'jose_manuel')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      state: data?.state_json || null,
      updatedAt: data?.updated_at || null,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const state = body?.state;
    if (!state || typeof state !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid state payload' }, { status: 400 });
    }

    const userName = state.userProfile?.name || 'José Manuel';
    const currentDateStr = state.currentDate || '2026-11-06';
    const sobrietyStartDate = state.abstinence?.startDate || state.sobrietyStartDate || '2026-10-14';
    const sobrietyDays = Number(state.abstinence?.days ?? state.sobrietyDays ?? 1);
    const weightKg = Number(state.userProfile?.weight ?? 74.5);
    const monthlyIncome = Number(state.accounting?.currentMonthIncome ?? 0);

    // 1. Guardar estado maestro en public.aegis_state
    const { error: stateErr } = await supabase.from('aegis_state').upsert(
      {
        id: 'jose_manuel',
        user_name: userName,
        current_date_str: currentDateStr,
        sobriety_start_date: sobrietyStartDate,
        sobriety_days: sobrietyDays,
        weight_kg: weightKg,
        monthly_income: monthlyIncome,
        state_json: state,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (stateErr) {
      return NextResponse.json({ ok: false, error: stateErr.message }, { status: 500 });
    }

    // 2. Sincronizar registros diarios en public.aegis_daily_records
    if (Array.isArray(state.dailyRecords) && state.dailyRecords.length > 0) {
      const recordsPayload = state.dailyRecords
        .filter((r) => r && r.isoDate)
        .map((r) => ({
          iso_date: String(r.isoDate),
          date_label: String(r.date || r.isoDate),
          sobriety_day: Number(r.sobrietyDay || 1),
          weight: Number(r.weight || 74.5),
          sleep_hours: Number(r.sleepHours || 9.0),
          sleep_protocol: Boolean(r.sleepProtocol),
          meals_count: Number(r.mealsCount ?? 7),
          med_blocks_count: Number(r.medBlocksCount ?? 4),
          pomodoro_cycles: Number(r.pomodoroCycles ?? 0),
          craving_max: Number(r.cravingMax ?? 1),
          notes: String(r.notes || ''),
        }));

      if (recordsPayload.length > 0) {
        await supabase
          .from('aegis_daily_records')
          .upsert(recordsPayload, { onConflict: 'iso_date' });
      }
    }

    // 3. Sincronizar transacciones del Libro Mayor en public.aegis_ledger
    if (Array.isArray(state.accounting?.ledger) && state.accounting.ledger.length > 0) {
      const ledgerPayload = state.accounting.ledger
        .filter((tx) => tx && tx.id)
        .slice(0, 100)
        .map((tx) => ({
          id: String(tx.id),
          tx_timestamp: tx.timestamp || new Date().toISOString(),
          tx_type: String(tx.type || 'Movimiento'),
          category: String(tx.category || 'General'),
          description: String(tx.description || ''),
          bucket: String(tx.bucket || ''),
          amount: Number(tx.amount || 0),
        }));

      if (ledgerPayload.length > 0) {
        await supabase.from('aegis_ledger').upsert(ledgerPayload, { onConflict: 'id' });
      }
    }

    // 4. Sincronizar medicamentos en public.aegis_medications
    if (Array.isArray(state.medication?.medsList) && state.medication.medsList.length > 0) {
      const medsPayload = state.medication.medsList
        .filter((m) => m && m.id)
        .map((m) => ({
          id: String(m.id),
          name: String(m.name || 'Medicamento'),
          dose: String(m.dose || ''),
          time_block: String(m.timeBlock || '07:00'),
          tmax: Number(m.tmax || 3.0),
          halflife: Number(m.halflife || 12.0),
          role: String(m.role || ''),
          updated_at: new Date().toISOString(),
        }));

      if (medsPayload.length > 0) {
        await supabase.from('aegis_medications').upsert(medsPayload, { onConflict: 'id' });
      }
    }

    return NextResponse.json({ ok: true, syncedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
