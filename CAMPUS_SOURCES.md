# Campus model references — current layout 1.5.7

The primary layout references for this revision are the user's ten Google Earth aerial/ground screenshots supplied November 16, 2026. They show the main lake/academic core, the north residential and athletic clusters, field shapes, detached building gaps and an ENS/Tyler-area street view. The original screenshots retain their Google attribution and are not embedded or downloaded as game textures.

Coordinates were manually traced into a common north-up frame. One game unit represents approximately half a meter; relative locations, proportions and exterior heights are estimates rather than a georeferenced survey. The main aerial frame was aligned through repeated lake, DMC, SBCC, SSC, library and ENS landmarks. Older schematic positions do not override those aerial footprints. Uncovered outlying details remain approximate; this update prioritizes the photographed core and athletic areas. Floor-area metadata below is historical context, not an exterior footprint measurement.

The renderer uses original polygon/terrain/field geometry and the existing game materials. The grid is deliberately bounded for mobile performance. Sidewalk surfaces are subdivided along the same ground triangles used by movement. Both campus map and collision use actual traced outlines rather than bounding rectangles.

## Earlier reference notes (prior schematic layout)

# Campus model references and accuracy

## Layout and names

The two supplied campus screenshots establish the requested setting, but their labels are too small for reliable transcription. The higher-resolution official printable map was used to resolve names and relative locations:

- [Cedarville campus map and building abbreviations](https://www.cedarville.edu/why-cedarville/campus-map)
- [Official color campus PDF](https://www.cedarville.edu/-/media/Files/PDF/About/Cedarville-University-Campus-Map.pdf)

The illustrated map is not a survey or an orthographic architectural site plan. Coordinates in the game trace its visible building masses and paths; they are **estimates**. Its north arrow points to the right, which the game map preserves. Where the PDF's extracted text layer differs from its visible graphic, the visible building labels were used. The current map also marks Bolthouse construction; this remains a closed exterior rather than a playable map.

The contiguous main campus represented by the map is walkable. Off-site properties listed in the map legend have not been relocated into invented positions on the main campus.

## Published floor areas

| Building | Published gross floor area | Model treatment |
| --- | ---: | --- |
| Engineering and Science Center | 95,000 sq ft; three stories | Three-story exterior massing; approximate footprint |
| Scharnberg Business and Communication Center | 65,000 sq ft | Two-story exterior, glass frontage and dark canopy; approximate footprint |
| Stevens Student Center | 150,000 sq ft | Broad brick/glass mass with colonnade and lake-facing patio |
| Dixon Ministry Center | 120,000 sq ft | Broad chapel mass and columned entrance |
| Centennial Library | 66,000 sq ft; two stories | Two-story exterior massing |
| Engineering Projects Laboratory | 8,800 sq ft | Single-story laboratory massing |
| Apple Technology Resource Center | 24,000 sq ft | Approximate academic-building massing |

Sources:

- [University catalog: facilities, ENS, DMC, SSC and EPL](https://publications.cedarville.edu/archives/catalogs/undergraduate/2025-2026/5/)
- [University: library facilities](https://www.cedarville.edu/academics/about/academic-support-and-assistance)
- [University catalog: Apple facilities](https://publications.cedarville.edu/academiccatalogs/2026-2027/)
- [SBCC architect project page](https://www.bhdp.com/our-work/cedarville-university-scharnberg-business-and-communication-center)
- [University SBCC opening announcement](https://www.cedarville.edu/news/2024/new-scharnberg-business-and-communication-center-open)

Gross floor area is the sum of floors, **not** a building's ground footprint. It does not establish exact width, depth or height. The game does not claim surveyed dimensions or exact façade reproductions. Unverified building heights and footprints are generalized to keep the campus lightweight and consistent with the indoor game scale.

## Exterior and patio references

- [REALM: Stevens Student Center Plaza, including the aerial patio photograph](https://www.realmcollaborative.com/work/cedarville-university-stevens-student-center-plaza)
- [BHDP: SBCC exterior and veranda photography](https://www.bhdp.com/our-work/cedarville-university-scharnberg-business-and-communication-center)
- [University: students leaving Dixon Ministry Center](https://www.cedarville.edu/parent-resources/parentprep/post/4-tips-to-make-the-most-of-a-college-visit)
- [University: engineering facilities and expansion history](https://www.cedarville.edu/academics/schools/engineering-and-computer-science/facilities)

The SSC patio has curved paving and fixed outdoor seating in front of the lake-facing student center. All trading tables are placed on that patio. The row/grid arrangement is adapted for the game's 24 two-person trade stations rather than claimed as an exact count/layout of real campus furniture.

Photography and the official PDF were used as reference, not bundled as runtime textures. The model uses original procedural geometry/materials and generalized exterior details. Some reference searches returned mislabeled buildings; a photograph visibly marked Stevens Student Center was treated as SSC, not as ENS. ENS and smaller buildings rely more heavily on the official illustrated map where an independently verified façade reference was unavailable.

## 1.5.0 terrain and SSC circulation repair

The previous flat ground missed the landscape grading visible in the references. Additional references reviewed for this update include:

- [REALM: SBCC event lawn, terraced seating and lakeside circulation](https://www.realmcollaborative.com/work/cedarville-school-of-business)
- [REALM: SSC plaza, including the aerial patio photograph](https://www.realmcollaborative.com/work/cedarville-university-stevens-student-center-plaza)
- [Cedarville: lakeside patio sunset photograph](https://www.cedarville.edu/admissions/visit)
- [Cedarville: Homecoming lakeside lawn photograph](https://www.cedarville.edu/media/video-player/1_5sjeyhbh)

The landscape architect describes the plaza stepping down toward Cedar Lake and the SBCC terrace/amphitheater connecting to the lake walk. The photos show sloped grass banks and terraced retaining/seating walls. Those visible relationships guide the new grades; they do not establish exact elevations. Relative heights, the broad western rise and path slopes remain approximations. No surveyed terrain dataset or measured elevation plan was available for this model.

The SSC's estimated footprint was set farther back from the lake to clear its promenade. Small clearance corrections at Chick-fil-A/BTS and detours at building corners prevent the illustrated-map footprints from cutting the walking circuit. These are gameplay-scale footprint corrections, not a claim that buildings have moved on the real campus. The SSC patio and all 24 trade tables stay in place.

The terrain is triangulated at finer resolution near the water. Camera, avatar feet and server movement use the same triangle heights; level water, raised foundations, paved surfaces and the flat trade patio use their corresponding surface heights. The indoor ENS/SBCC maps are unchanged.
