use anchor_lang::prelude::*;

#[account]
pub struct Game {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub bump: u8,
    pub date_created: i64,
    // pub leaderboards: [Pubkey; 10],
}
