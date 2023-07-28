// use anchor_lang::prelude::*;
// use anchor_lang::solana_program::program::invoke_signed;
// use anchor_lang::solana_program::sysvar::rent;
// // use anchor_spl::associated_token::AssociatedToken;
// // use anchor_spl::token::{mint_to, MintTo};
// // use anchor_spl::token::{Mint, Token, TokenAccount};
// // use mpl_token_metadata::instruction::create_metadata_accounts_v3;
// // use mpl_token_metadata::pda::find_metadata_account;
// // use mpl_token_metadata::state::Creator;

// use crate::clicker_accounts::game_account::Game;
// use crate::clicker_globals::constants::GAME_SEED;


// #[derive(Accounts)]
// pub struct Create<'info>{
//     #[account(
//         init,
//         seeds = [GAME_SEED, owner.key().as_ref()],
//         bump,
//         payer = owner,
//         space = std::mem::size_of::<Game>() + 8,
//     )]
//     pub game: Account<'info, Game>,

//     // #[account(
//     //     init,
//     //     payer = owner,
//     //     mint::decimals = 0,
//     //     mint::authority = game,
//     //     mint::freeze_authority = game
//     //     )]
//     //     pub mint: Account<'info, Mint>,

//     pub mint: Signer<'info>,

//     // #[account(
//     //     init,
//     //     payer = owner,
//     //     associated_token::mint = mint,
//     //     associated_token::authority = game,
//     //     )]
//     //     pub owner_vault: Account<'info, TokenAccount>,

//     // #[account(mut, address = find_metadata_account(& mint.key()).0)]
//     // /// CHECK: TODO - look into making sure it's unitialized
//     // pub metadata: UncheckedAccount<'info>,

//     // --------- Programs ----------
//     #[account(address = mpl_token_metadata::ID)]
//     /// CHECK: We check it by address here
//     pub token_metadata_program: UncheckedAccount<'info>,
//     pub associated_token_program: Program<'info, AssociatedToken>,
//     pub system_program: Program<'info, System>,
//     pub token_program: Program<'info, Token>,
//     #[account(address = rent::id())]
//     /// CHECK: We check it by address here
//     pub rent: AccountInfo<'info>,
    

//     #[account(mut)]
//     pub owner: Signer<'info>,
// }

// #[derive(Clone, AnchorSerialize, AnchorDeserialize)]
// pub struct NFTParams {
//     pub name: String,
//     pub symbol: String,
//     pub uri: String,
// }

// pub fn run_create(ctx: Context<Create>, bump: u8, nft_params: NFTParams) -> Result<()> {

//     // {
//     //     msg!("Mint to Vault");
//     //     mint_to(
//     //         CpiContext::new_with_signer(
//     //             ctx.accounts.token_program.to_account_info(),
//     //             MintTo {
//     //                 mint: ctx.accounts.mint.to_account_info(),
//     //                 to: ctx.accounts.owner_vault.to_account_info(),
//     //                 authority: ctx.accounts.game.to_account_info(),
//     //             },
//     //             &[&[GAME_SEED, ctx.accounts.owner.key().as_ref(), &[bump]]],
//     //         ),
//     //         1,
//     //     )?;
//     // }

//     // {
//     //     msg!("Create Metadata");
//     //     let account_info = vec![
//     //         ctx.accounts.metadata.to_account_info(), // Metadata Account
//     //         ctx.accounts.mint.to_account_info(),     // Mint Account
//     //         ctx.accounts.game.to_account_info(),        // Mint Authority Account
//     //         ctx.accounts.owner.to_account_info(),               // Payer Account
//     //         ctx.accounts.token_metadata_program.to_account_info(), // Token Metadata Program Account
//     //         ctx.accounts.token_program.to_account_info(),       // Token Program Account
//     //         ctx.accounts.system_program.to_account_info(),      // System Program Account
//     //         ctx.accounts.rent.to_account_info(),                // Rent Account
//     //     ];

//     //     let creator = vec![
//     //         Creator {
//     //             address: ctx.accounts.owner.key(), // User Account - Because its the signer
//     //             verified: false,
//     //             share: 100,
//     //         },
//     //     ];

//     //     invoke_signed(
//     //         &create_metadata_accounts_v3(
//     //             ctx.accounts.token_metadata_program.key(),
//     //             ctx.accounts.metadata.key(),
//     //             ctx.accounts.mint.key(),
//     //             ctx.accounts.game.key(),
//     //             ctx.accounts.owner.key(),
//     //             ctx.accounts.game.key(),
//     //             nft_params.name,
//     //             nft_params.symbol,
//     //             nft_params.uri,
//     //             Some(creator),
//     //             0,
//     //             true,
//     //             true,
//     //             None,
//     //             None,
//     //             None
//     //         ),
//     //         account_info.as_slice(),
//     //         &[&[GAME_SEED, ctx.accounts.owner.key().as_ref(), &[bump]]],
//     //     )?;
//     // }

//     {
//         let game = &mut ctx.accounts.game;

//         game.owner = ctx.accounts.owner.key().clone();
//         // game.mint = ctx.accounts.mint.key().clone();
//         game.bump = bump;
//         game.date_created = Clock::get()?.unix_timestamp;
//         // game.leaderboards = [Pubkey::default(); 10];
//     }


//     Ok(())
// }