use anchor_lang::prelude::*;
use crate::clicker_accounts::clicker_account::Clicker;
use crate::clicker_globals::constants::{BASE_COSTS, BASE_POINTS};
use crate::clicker_globals::errors::CodeErrors;
use crate::clicker_globals::helpers::get_upgrade_cost;

#[derive(Accounts)]
#[instruction(upgrade_index: u8, amount: u8)]
pub struct Upgrade<'info>{
    #[account(
        mut,
        has_one = player,
    )]
    pub clicker: Account<'info, Clicker>,

    #[account(mut)]
    pub player: Signer<'info>,
}

pub fn run_upgrade(ctx: Context<Upgrade>, upgrade_index: u8, amount: u8) -> Result<()> {
    let clicker = &mut ctx.accounts.clicker;

    if amount == 0 {
        return Err(error!(CodeErrors::NotAValidAmount));
    }

    if upgrade_index >= BASE_COSTS.len() as u8 || upgrade_index >= BASE_POINTS.len() as u8 {
        return Err(error!(CodeErrors::NotAValidUpgrade));
    }

    {
        let cost = get_upgrade_cost(
            BASE_COSTS[upgrade_index as usize], 
            clicker.clicker_upgrades[upgrade_index as usize], 
            amount
        );

        if clicker.points < cost {
            return Err(error!(CodeErrors::NotEnoughToFundUpgrade));
        }

        clicker.points -= cost;
        clicker.clicker_upgrades[upgrade_index as usize] += amount as u16;
    }

    Ok(())
}