use anchor_lang::prelude::*;
use anchor_lang::solana_program::log::sol_log_compute_units;

use clicker_instructions::click_instruction::*;
use clicker_instructions::start_instruction::*;
use clicker_instructions::upgrade_instruction::*;
use clicker_instructions::create_instruction::*;


// Instructions
mod clicker_instructions;

// Globals
mod clicker_globals;

// Accounts
mod clicker_accounts;

declare_id!("67714KFVqCYNTu7NUCjtMuid55dKutnXmjXpeqJEwmpu");

#[program]
pub mod upgrade {

    use super::*;

    // pub fn create(ctx: Context<Create>, bump: u8, nft_params: NFTParams) -> Result<()> {
    //     run_create(ctx, bump, nft_params)?;
    //     sol_log_compute_units();

    //     Ok(())
    // }

    pub fn start(ctx: Context<Start>) -> Result<()> {
        run_start(ctx)?;
        sol_log_compute_units();

        Ok(())
    }

    pub fn click(ctx: Context<Click>) -> Result<()> {
        run_click(ctx)?;
        sol_log_compute_units();

        Ok(())
    }

    pub fn upgrade(ctx: Context<Upgrade>, upgrade_index: u8, amount: u8) -> Result<()> {
        run_upgrade(ctx, upgrade_index, amount)?;
        sol_log_compute_units();

        Ok(())
    }
}


