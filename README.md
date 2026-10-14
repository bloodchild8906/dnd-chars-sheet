# dnd-chars-sheet

An Owlbear Rodeo extension with a complete editable character builder, using the supplied VOX character sheet's dark panels, amber headings, cyan rolls, stat cards and tabbed layout. New installs open an empty sheet. Create a character with the six-step wizard; the VOX example is optional in Builder.

## Install the ready-to-host version

1. Unzip this package.
2. Upload **the contents of `dist/`** to an HTTPS static host, keeping the directory structure intact. No build step or server database is needed. The original optional Google Fonts are used with system-font fallbacks. The extension SDK is bundled locally; the build does not depend on an external SDK CDN.
3. In your Owlbear Rodeo profile, choose **Add Extension** and enter the hosted `manifest.json` URL, for example `https://your-host.example/manifest.json`. If hosted in a subdirectory, include that subdirectory.
4. Enable **dnd-chars-sheet** for your room and open its action icon.

The ZIP itself is not an Owlbear install link. The repository includes automated GitHub Pages deployment (see below). Your host must permit iframe embedding; do not set `X-Frame-Options: DENY` or `SAMEORIGIN`. Use HTTPS for shared hosting. Everyone in the room needs access to the same hosted extension.

## Try it locally on Windows

Install Node.js 22 or later, then double-click **Start-Local.cmd**. No npm install is needed to run the included build. Add `http://localhost:5173/manifest.json` to Owlbear while that window is open. This only works on your computer.

To edit the source, open PowerShell in this extracted folder:

```powershell
npm ci
npm run dev
```

Open the development address printed by Vite. For local Owlbear testing, add `http://localhost:5173/manifest.json` (or the printed port) to your profile and enable the extension in a room. This localhost link only works on the computer running the server. Keep the terminal open.

To serve the already-built folder with Python instead:

```powershell
py -m http.server 5173 --directory dist
```

## Build and play

- **+ NEW** opens the guided character wizard. Nothing is saved until you finish.
- **Builder** edits identity, total level, abilities, save training, skill proficiency/expertise, armor calculation, HP, spellcasting, spell slots, attacks, spells, items, feats/features, resources, and beast forms.
- **ADD VOX PRESET** makes another editable VOX. **DUPLICATE** copies the current character. The character selector switches without mixing state.
- Spell and item entries expand when clicked. Spell entries are sorted by level and name and can be searched.
- All ability, save, skill, attack and effect roll buttons use an integrated roller with history. ADV/DIS applies to a single d20; NORMAL represents cancellation. CRIT doubles damage dice only, not flat bonuses or healing. Roll outcomes do not automatically mean a hit or success.
- **CAST** spends a slot at your selected level and tracks concentration. It does not roll effects. Roll attack/damage/healing separately. Higher-slot damage is not inferred: change the formula or use the dice roller.
- **RITUAL** tracks the spell without a slot. Spellcasting is blocked in an active form; record any class-rule exception manually.
- HP damage uses temporary HP first. Healing caps at maximum. TEMP grants the higher of existing and entered temporary HP; edit Builder to replace or clear it.
- Spend Hit Dice to roll healing. Short rests reset configured resources; long rests restore HP, slots, configured resources, clear temporary HP/concentration/form, and recover Hit Dice according to the selected 2014/2024 convention. Custom rules use full Hit Dice recovery. Conditions are manual and do not alter rolls.
- Equipped/attuned items apply only their configured AC, saving-throw, spell-attack and spell-DC bonuses. Weapon attack bonuses are edited on the attack itself. No automatic attunement-limit enforcement.
- Forms spend the named resource, replace physical abilities/AC/speed and grant configured temporary HP. Form attacks have explicit bonuses. Mental stats and character save/skill proficiencies remain. Equipment stays active until toggled off. Apply beast skill upgrades, special saves, duration, swimming/climbing speeds and other exceptions manually.
- The builder is a configurable tracker, not a full D&D rules database, rules validator, or automatic level-up engine. Choose legal class, ancestry, feat, proficiency, slot and spell combinations using your own books. Multiclass is a label plus manually configured totals.

## Dice formulas

Use terms such as `2d6+3`, `1d20+5` or `2d8+1d4-1`. Builder formulas support:

| Token | Value |
| --- | --- |
| `@mod` | Selected attack ability modifier (STR by default outside attacks) |
| `@spell` | Spellcasting ability modifier |
| `@prof` | Proficiency bonus from total level |
| `@level` | Total character level |

Maximum: 100 dice, 2–1000 sides, plus bounded numeric modifiers. Rolls use the browser's cryptographic random generator with rejection sampling. They are client-generated, not independently verified by the server.

## Saving and sharing

**Local autosave:** sheets and recent history save in the browser, separately for each Owlbear player and room. Standalone preview uses a different local store. Closing and reopening the action restores the sheet. Local saves do not sync across devices or hosts. Clearing browser data deletes them; export JSON backups.

**EXPORT / IMPORT:** download the current sheet as JSON, or paste/upload a `dnd-chars-sheet` JSON export to add a new local character. Import does not overwrite the current sheet. Original VOX HTML/local-storage JSON is a different format; start with the supplied preset and transfer any extra notes manually. Browser storage failures show a warning.

**SAVE TO TOKEN:** select exactly one image token on the Character layer. The extension asks before writing the complete sheet snapshot, including notes, to namespaced token metadata. This is shared room data, not private or GM-only storage. Existing snapshots are overwritten only after confirmation. The extension permits the snapshot owner or GM to replace an existing snapshot; this is an application convention, not an access-control boundary against other extensions. Owlbear's own permissions still apply.

**LOAD TOKEN:** adds the selected token's snapshot as a new local character. It never silently overwrites current work. Token snapshots are manual; later local edits are not automatically pushed, and there is no merge/conflict resolution. Save again explicitly to refresh a snapshot. Snapshots over 48 KB are rejected with an export suggestion; host-side limits can also reject a write.

**Share rolls with room:** off by default. When enabled, sends each roll label, character name, expression, result and breakdown to other users of this extension in the room. A background page displays incoming roll notifications even while their sheet is closed. Open sheets also record incoming rolls in local history. Closed sheets do not retain those broadcasts as history. No notes are included in dice broadcasts.

## VOX preset and original layout

The preset derives from the uploaded VOX.html. It retains the supplied level-5 values, equipment, contacts, resources and six beast forms. The original file is also included at `dist/VOX-original.html` for comparison. That reference page is standalone and does not use the extension's storage or builder.

The supplied character mixes a 2024 Druid chassis with Circle of Wildfire and older beast forms. The preset preserves this choice and labels provisional selections. Spell descriptions are short play reminders, not complete rules text; fill in your preferred versions in Builder. The original file listed several spells by name only. Backstory and personality are blank for the player to fill.

## Source and verification

```powershell
npm run build
npm test
```

The build produces `dist/`. Tests use Node.js 22.15+ / 24 (`node:module` registerHooks is used for the SDK mock). The model tests cover derived stats, equipment, temporary HP, forms, rests, dice parsing and JSON validation. SDK adapter tests simulate token selection, metadata preservation, owner checks, and broadcasts. Browser checks cover builder edits, persistence, spell slots, form controls, dice, import/export, character creation and mobile layout. The extension has not been live-tested in an authenticated Owlbear room.

Important files: `src/model.js` (calculations/validation/dice), `src/preset.js` (VOX), `src/main.js` (builder/play UI), `src/obr.js` (Owlbear integration), `src/background.js` (roll notifications), `public/manifest.json` (extension entry point).

## Official references

- https://docs.owlbear.rodeo/extensions/tutorial-hello-world/create-your-manifest/
- https://docs.owlbear.rodeo/extensions/tutorial-hello-world/install-your-extension/
- https://docs.owlbear.rodeo/extensions/tutorial-hello-world/install-the-sdk/
- https://docs.owlbear.rodeo/extensions/reference/manifest/
- https://docs.owlbear.rodeo/extensions/reference/metadata/
- https://docs.owlbear.rodeo/extensions/apis/scene/items/
- https://docs.owlbear.rodeo/extensions/apis/broadcast/

Third-party dependency notices are in `THIRD_PARTY_NOTICES.txt`.

## GitHub Actions and GitHub Pages

`.github/workflows/pages.yml` runs `npm ci`, the test suite, a clean Vite build, and manifest/asset validation for pushes and pull requests to `main`. Pull requests do not deploy or receive deployment write permissions. Successful pushes to `main`, and manual runs from `main`, upload `dist` and deploy through GitHub's official Pages actions and the `github-pages` environment. The resulting manifest URL is printed in the deployment job summary.

GitHub Pages must use **GitHub Actions** as its publishing source. No personal token or repository secret is needed: the deployment job uses the scoped `GITHUB_TOKEN` and OIDC permissions. Actions are pinned to verified commit SHAs; Dependabot checks action updates monthly.

The Actions build sets `BASE_PATH` to the repository subpath, as required by Vite's GitHub Pages guide. Local builds keep relative URLs. The build rewrites the Owlbear manifest's popover, icon and background URLs to explicit origin-relative paths containing the deployment base. This prevents Owlbear from opening the host root instead of the repository folder. A future custom domain needs `BASE_PATH: /` in the workflow.

The workflow publishes only `dist`, not source files or browser saves. GitHub Pages is public even though local character data remains in each user's browser until they explicitly share it. A downloaded prebuilt `dist` is convenient for local use; deployment always rebuilds source instead of relying on committed build files.

Official deployment references:
- https://docs.owlbear.rodeo/extensions/tutorial-sharing-your-extension/hosting-your-extension/
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://vite.dev/guide/static-deploy.html#github-pages

### If Owlbear shows a GitHub Pages 404

Manifest version 1.0.1 fixes deployment paths: its popover, icon and background page use explicit `/dnd-chars-sheet/` paths on GitHub Pages. If you installed version 1.0.0, refresh or re-add the extension using the same manifest URL, then reload the room so Owlbear reads the updated manifest. The GitHub account root is not this extension's site; the project lives at `/dnd-chars-sheet/`.

## Installer v1.0.2

The hosted build now uses full HTTPS manifest URLs and a high-contrast amber D20 icon. A fresh install URL is https://bloodchild8906.github.io/dnd-chars-sheet/manifest-v1.0.2.json . Disable the older extension and add this URL to avoid an older cached manifest. Browser-local character saves keep the same storage key and hostname. The normal manifest.json is also updated. SITE_URL and BASE_PATH must both be changed if moving to another host or a custom domain.

## Wizard, progression and compendiums (v1.1.0)

Creation walks through identity/origins, class, ability scores, training/magic, equipment/feats and review. Canceling leaves existing characters intact. Existing saves are preserved; an existing VOX character can be deleted if you want an empty start.

Use **Level up / multiclass** to advance an existing class or add a different class. Total level, proficiency bonus, HP and separate Hit Dice pools update. Class features for the acquired level are imported when available. Long rests restore class Hit Dice according to the selected edition. Legacy single-class sheets migrate when leveling; split old free-text multiclass summaries into structured class rows before relying on their individual Hit Dice.

The default data directory is https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/ . Classes load automatically. Load species, backgrounds, feats, items and spells from wizard buttons or Compendium. Spell loading uses PHB/XPHB; import other sources as 5etools-compatible JSON. Source labels distinguish books/editions. You can change the HTTPS data directory or import custom homebrew JSON (3 MB saved limit). Homebrew persists in this browser; network-loaded data is fetched again on reload. Character exports include selected content, not the entire compendium. Failed requests show an error and allow retry or file import.

Supported JSON arrays: class, subclass, classFeature, subclassFeature, race, background, feat, spell, item. Descriptions are rendered as text; 5etools markup is simplified. This is not the complete 5etools renderer: inheritance (_copy), cross-references and all mechanical effects are not resolved. Review imported entries.

This is a guided editable tracker, not a complete rules engine. Review multiclass prerequisites, subclass/feat choices, spell slots (including Pact Magic), item/armor/attack bonuses and edition-specific choices. Ability changes do not retroactively recalculate HP. Starting proficiencies and spellcasting ability default from the chosen class when supplied; other choices remain editable.
