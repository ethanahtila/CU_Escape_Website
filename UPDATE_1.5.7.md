# CU Escape 1.5.7 — Campus Reframed

Desktop and mobile share the rebuilt outdoor waiting campus. Indoor ENS/SBCC layouts, entities, escape rules, progression and chat controls are unchanged.

## Campus layout

The main campus now follows the supplied aerial photographs with north at the top of the campus map. The SSC is west of the lake, SBCC sits between the SSC and DMC on the north-west side, BTS/Library/Apple follow the eastern shore, and ENS/Milner/Tyler sit farther south. Athletic areas extend north, with intramural space to the north-east. Relative sizes and spacing are traced approximations, not surveyed measurements.

Main buildings use individual polygon footprints, including the DMC's angled auditorium outline, the SBCC's faceted footprint, ENS's stepped wings, irregular SSC/library outlines and open residence courtyards. The same polygons drive walls, roofs, collision, map shapes and label occlusion. Buildings no longer share accidentally overlapping rectangular envelopes. Doorways are placed on real exterior edges of those polygons. Existing gross-area metadata is not treated as a footprint measurement.

Street, lake-loop and promenade routes were repositioned to avoid walls and ponds. The SSC trading tables remain on its lakeside patio. The directory, mini/full campus maps, trading waypoint and outdoor spawn use the revised coordinates. The directory also offers outdoor field waypoints without adding escape-map options.

## Ground and sidewalks

Sidewalks, roads, court surfaces and field markings are clipped to the exact triangles used by the ground mesh, rather than spanning hills with long flat faces. This keeps pavement above the surface throughout a triangle's interior, not only at its corners. Ground-following movement uses the same terrain triangles. The campus retains hills, sloping banks and the SBCC amphitheater.

The software fallback now uses depth-buffered rendering rather than approximate painter sorting, avoiding grass triangles appearing over pavement or props. The normal WebGL renderer still uses cached geometry uploaded once. In this workspace, static geometry fell from approximately **10.42 MiB to 5.85 MiB** despite the expanded outdoor area. Rendering is distance-culled and no new network update loop or database work was added. These are geometry measurements, not a claim of a particular frame rate on every phone.

## Walkable athletics

The outdoor lobby includes soccer/intramural areas, the track, baseball and softball diamonds, tennis, pickleball, basketball and disc-golf areas. They have distinct surfaces and markings, with oval track lanes, baseball infields/bases, goal frames, court nets and disc-golf baskets. All can be reached on foot from the SSC lobby. Vegetation avoids the fields, roads, paved routes and door approaches.

These areas are scenery and gathering spaces, not escape maps or new sports game modes. Only ENS and SBCC remain playable building entrances. Other building doors retain Coming soon behavior.

## Deploy and verification

Commit the entire updated project, including **public/campus-world.js**, **public/campus-renderer.js**, **public/campus.js**, **campus.cjs** and both HTML clients, let Render redeploy and refresh all open tabs. No account reset, database migration or new service is needed. The package does not publish itself.

Checks cover non-overlapping building polygons, clear water boundaries, open courtyards, real exterior doors, lake-loop/promenade walking, routes to every field, pavement clearance through triangle interiors, server movement acceptance, static-memory limits, reused GPU uploads and the software depth-buffer fallback. Campus views were rendered and visually inspected. Dimensions outside the supplied views remain approximate. No live Render or physical iPhone test is claimed.
