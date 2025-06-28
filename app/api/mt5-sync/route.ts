// app/api/mt5-sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // You need to add this to your .env.local
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract email and trade data
    const { email, action, trade } = body;
    
    // Validate required fields
    if (!email || !action || !trade) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const userId = userData.id;
    
    // Handle different actions
    if (action === 'TRADE_OPEN') {
      // Store open trade info (you might want a separate table for open trades)
      console.log('Trade opened:', trade);
      // For now, we'll just acknowledge it
      // Later you can add logic to track open trades
      
    } else if (action === 'TRADE_CLOSE') {
      // Save closed trade to the trades table
      const { error: tradeError } = await supabase
        .from('trades')
        .insert({
          user_id: userId,
          created_at: new Date().toISOString(),
          instrument: trade.symbol,
          type: trade.type,
          lot_size: trade.lot_size || 0.1,
          profit: trade.profit || 0,
          entry_price: trade.entry_price || 0,
          exit_price: trade.exit_price || 0,
          pips: trade.pips || 0,
          instructor: trade.comment || 'MT5 Import', // Use comment field for instructor
          custom_instructor: 'MT5 Import'
        });
      
      if (tradeError) {
        console.error('Error saving trade:', tradeError);
        return NextResponse.json(
          { error: 'Failed to save trade' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Trade ${action} processed successfully`
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
