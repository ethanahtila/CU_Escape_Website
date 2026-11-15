# CU Escape 1.5.0 — Lake Banks and SSC Promenade

Desktop and mobile use **1.5.0 / protocol 40**.

## Open walking routes

The SSC footprint was too close to the lake, and part of the old path crossed the building. Its exterior mass is now set back, with a continuous lakeside promenade and a walkable route around all four sides. Related clearance corrections near Chick-fil-A, Centennial Library, BTS and SBCC keep the lake circuit from running into building corners or water.

All **24 trading tables remain on the SSC lakeside patio**. Public ENS/SBCC lobbies and private room-name play remain available.

## Actual changes in ground height

The previous ground plane is replaced by walkable terrain: sloped lawns down to the lake, raised ground farther from the shore, a broad western rise, and SBCC terrace landscaping with brick retaining seats and a central walking flight. Paths and roads follow the grades. Water stays level, while the trade patio and building pads remain level at their respective elevations.

The camera rises and falls as you walk. Other players and physical scenery are placed at their local surface heights. Camera and movement sample the same adaptive triangles used by the ground mesh, including on the server, to avoid floating or dropping through mismatched surfaces.

Additional campus, plaza and amphitheater photos were reviewed; see **CAMPUS_SOURCES.md**. These elevations are **photo-guided approximations**, not surveyed campus heights or a claim of an exact digital twin. The indoor escape maps and their mechanics are unchanged.

## Performance and validation

Terrain geometry is baked once when the campus opens, uses spatial chunks and distance culling, and is reused while walking. Nearby shorelines get more detail than distant ground. Grade samples are cached on a bounded campus grid; there are no per-frame geometry rebuilds or new database requests for hills. The campus still releases its renderer, animation and connection before a building match starts.

Regression coverage includes the SSC perimeter and promenade, the complete lakeside walking circuit, changing ground heights, fixed patio/table placement, exact rendered-triangle height sampling, sloped movement through the real server, public lobbies, multiplayer, saved progression and resource cleanup. Graphics shaders and rendered grade views were also checked with a GLES driver. Physical iPhone/GPU and live Wi-Fi performance remain to be checked after deployment.

## Deploy

Replace all corresponding GitHub files, **commit**, wait for Render to deploy, then refresh every player's browser. Include the shared campus world, renderer and controls as well as both HTML clients and the server/version files. The menu should show **Records connected · 1.5.0**. Keep the same single Node service and Turso database; no account reset or manual database upload is needed.

This archive has not been deployed by this chat.

Validation: **141 full-suite tests passed, zero failed**. The final landscape rendering/route checks also passed all 12 focused campus tests after scenery placement cleanup.
