use anchor_lang::prelude::*;
use crate::clicker_accounts::clicker_account::Clicker;
use crate::clicker_accounts::game_account::Game;
use crate::clicker_globals::constants::CLICKER_SEED;



#[derive(Accounts)]
pub struct Start<'info>{
    #[account(
        init,
        seeds = [CLICKER_SEED, game.key().as_ref(), player.key().as_ref()],
        bump,
        payer = player,
        space = std::mem::size_of::<Clicker>() + 8,
    )]
    pub clicker: Account<'info, Clicker>,

    #[account()]
    pub game: Box<Account<'info, Game>>,

    #[account(mut)]
    pub player: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn run_start(ctx: Context<Start>) -> Result<()> {

    let clicker = &mut ctx.accounts.clicker;
    let now = Clock::get()?.unix_timestamp;

    clicker.initialized = true;
    clicker.player = ctx.accounts.player.key().clone();
    clicker.game = ctx.accounts.game.key().clone();

    clicker.points = 0; 
    clicker.game_flags = 0;
    clicker.clicker_modifiers = [0; 16];
    clicker.clicker_upgrades = [0; 16];
    clicker.date_created = now;
    clicker.last_updated = now;

    Ok(())
}

