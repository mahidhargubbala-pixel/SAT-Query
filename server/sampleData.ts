import { ImageMetadata } from '../src/types.js';

// High-fidelity SVG/DataURL generator for remote sensing simulation
function createSatelliteSvgDataUrl(type: 'port' | 'urban' | 't1' | 't2' | 'optical' | 'sar'): string {
  if (type === 'port') {
    // Coastal port & harbor with water, docks, ships, containers
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <radialGradient id="water" cx="20%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#14324f" />
          <stop offset="100%" stop-color="#0b1d30" />
        </radialGradient>
        <pattern id="containers" width="16" height="12" patternUnits="userSpaceOnUse">
          <rect width="6" height="10" fill="#cf4a30" />
          <rect x="8" width="6" height="10" fill="#2c7be5" />
        </pattern>
        <pattern id="urban-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="28" height="28" fill="#6c7a89" opacity="0.6"/>
          <rect x="2" y="2" width="10" height="10" fill="#8d99ae"/>
          <rect x="14" y="14" width="12" height="12" fill="#52616b"/>
        </pattern>
      </defs>
      <!-- Deep coastal water body on left & top -->
      <rect width="600" height="600" fill="url(#water)"/>
      <path d="M0,0 L600,0 L600,600 L360,600 Q330,480 390,390 T300,210 Q210,180 180,300 T0,350 Z" fill="#2d3748"/>
      <!-- Vegetated coastline buffer -->
      <path d="M600,600 L380,600 Q350,490 410,400 T320,230 Q230,200 200,320 T0,370 L0,600 Z" fill="#2d5a27" opacity="0.85"/>
      <!-- Urban built-up zone -->
      <rect x="360" y="280" width="220" height="300" fill="url(#urban-grid)"/>
      <!-- Port Terminals & Piers -->
      <rect x="150" y="200" width="160" height="24" rx="3" fill="#95a5a6" transform="rotate(-15 150 200)"/>
      <rect x="210" y="270" width="180" height="28" rx="3" fill="#95a5a6" transform="rotate(-15 210 270)"/>
      <rect x="260" y="340" width="170" height="26" rx="3" fill="#95a5a6" transform="rotate(-15 260 340)"/>
      <!-- Container yards -->
      <rect x="340" y="210" width="90" height="70" fill="url(#containers)"/>
      <rect x="370" y="140" width="80" height="60" fill="url(#containers)"/>
      <!-- Cargo vessels moored at docks -->
      <path d="M120,180 L170,165 L175,178 L125,193 Z" fill="#e74c3c"/>
      <circle cx="145" cy="177" r="4" fill="#ffffff"/>
      <path d="M170,250 L230,232 L235,247 L175,265 Z" fill="#f39c12"/>
      <path d="M220,320 L275,305 L280,319 L225,334 Z" fill="#3498db"/>
      <!-- Open water vessel -->
      <path d="M70,90 L110,80 L113,90 L73,100 Z" fill="#ecf0f1"/>
      <!-- Coordinate grid lines (subtle) -->
      <line x1="0" y1="200" x2="600" y2="200" stroke="#38bdf8" stroke-dasharray="4,8" opacity="0.25"/>
      <line x1="0" y1="400" x2="600" y2="400" stroke="#38bdf8" stroke-dasharray="4,8" opacity="0.25"/>
      <line x1="200" y1="0" x2="200" y2="600" stroke="#38bdf8" stroke-dasharray="4,8" opacity="0.25"/>
      <line x1="400" y1="0" x2="400" y2="600" stroke="#38bdf8" stroke-dasharray="4,8" opacity="0.25"/>
      <text x="15" y="30" fill="#38bdf8" font-family="monospace" font-size="12" opacity="0.8">SENTINEL-2 L2A | B4-B3-B2 TRUE COLOR | 10m GSD</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  }

  if (type === 'urban') {
    // Suburban / Agricultural fringe
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <pattern id="crop1" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="38" height="38" fill="#4d7c0f"/>
          <line x1="0" y1="10" x2="38" y2="10" stroke="#365314" stroke-width="2"/>
          <line x1="0" y1="20" x2="38" y2="20" stroke="#365314" stroke-width="2"/>
          <line x1="0" y1="30" x2="38" y2="30" stroke="#365314" stroke-width="2"/>
        </pattern>
        <pattern id="crop2" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="48" height="48" fill="#a16207"/>
        </pattern>
        <pattern id="builtup" width="25" height="25" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#64748b"/>
          <rect x="2" y="2" width="9" height="9" fill="#94a3b8"/>
        </pattern>
      </defs>
      <rect width="600" height="600" fill="#1e293b"/>
      <!-- Agricultural plots -->
      <rect x="0" y="0" width="320" height="280" fill="url(#crop1)"/>
      <rect x="0" y="290" width="320" height="310" fill="url(#crop2)"/>
      <!-- Meandering water canal -->
      <path d="M310,0 Q330,150 290,300 T340,600" fill="none" stroke="#0284c7" stroke-width="18"/>
      <!-- Expanding urban core on East -->
      <rect x="340" y="0" width="260" height="600" fill="url(#builtup)"/>
      <!-- Highway artery -->
      <line x1="0" y1="450" x2="600" y2="400" stroke="#f1f5f9" stroke-width="8"/>
      <line x1="0" y1="450" x2="600" y2="400" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8,8"/>
      <text x="15" y="30" fill="#38bdf8" font-family="monospace" font-size="12" opacity="0.8">BIGEARTHNET-S2 | NIR FALSE COLOR COMPOSITE | 10m GSD</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  }

  if (type === 't1') {
    // Bi-temporal T1 (2021: dense agricultural/fallow land, minimal built-up)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <pattern id="t1agri" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="47" height="47" fill="#4d7c0f"/>
        </pattern>
        <pattern id="t1open" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="57" height="57" fill="#854d0e"/>
        </pattern>
      </defs>
      <rect width="600" height="600" fill="#15803d"/>
      <rect x="20" y="20" width="280" height="260" fill="url(#t1agri)"/>
      <rect x="320" y="20" width="260" height="260" fill="url(#t1open)"/>
      <rect x="20" y="300" width="280" height="280" fill="url(#t1open)"/>
      <!-- Modest existing settlement in SE corner -->
      <rect x="380" y="380" width="180" height="180" fill="#64748b"/>
      <circle cx="440" cy="440" r="25" fill="#475569"/>
      <!-- River / stream -->
      <path d="M0,280 Q300,290 600,280" stroke="#0369a1" stroke-width="16" fill="none"/>
      <!-- Timestamp badge -->
      <rect x="15" y="15" width="240" height="28" rx="4" fill="#0f172a" opacity="0.85"/>
      <text x="25" y="34" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">TIMESTAMP T1: 2021-03-12</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  }

  if (type === 't2') {
    // Bi-temporal T2 (2024: major urban sprawl, new industrial buildings, reduced canopy)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <pattern id="t2agri" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="47" height="47" fill="#3f6212"/>
        </pattern>
        <pattern id="t2newurban" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="28" height="28" fill="#e2e8f0"/>
          <rect x="3" y="3" width="10" height="10" fill="#94a3b8"/>
          <rect x="15" y="15" width="10" height="10" fill="#64748b"/>
        </pattern>
      </defs>
      <rect width="600" height="600" fill="#166534"/>
      <!-- Reduced vegetation -->
      <rect x="20" y="20" width="180" height="240" fill="url(#t2agri)"/>
      <!-- NEW URBAN EXPANSION in NE (Changed!) -->
      <rect x="220" y="20" width="360" height="240" fill="url(#t2newurban)"/>
      <!-- NEW INDUSTRIAL WAREHOUSES in SW (Changed!) -->
      <rect x="40" y="320" width="240" height="240" fill="url(#t2newurban)"/>
      <!-- Expanded settlement SE -->
      <rect x="320" y="320" width="260" height="260" fill="#475569"/>
      <!-- River / stream -->
      <path d="M0,280 Q300,290 600,280" stroke="#0284c7" stroke-width="16" fill="none"/>
      <!-- Road network connecting new sites -->
      <line x1="220" y1="120" x2="320" y2="350" stroke="#f8fafc" stroke-width="6"/>
      <line x1="160" y1="400" x2="400" y2="400" stroke="#f8fafc" stroke-width="6"/>
      <!-- Timestamp badge -->
      <rect x="15" y="15" width="240" height="28" rx="4" fill="#0f172a" opacity="0.85"/>
      <text x="25" y="34" fill="#f43f5e" font-family="monospace" font-size="12" font-weight="bold">TIMESTAMP T2: 2024-03-10</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  }

  if (type === 'optical') {
    // Optical with partial clouds obscuring north sector
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="70%" stop-color="#e2e8f0" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <!-- Ground terrain -->
      <rect width="600" height="600" fill="#15803d"/>
      <rect x="300" y="200" width="280" height="380" fill="#475569"/>
      <!-- Flooded wetland / river basin -->
      <path d="M50,150 Q200,100 250,250 T150,550 T50,600 Z" fill="#0369a1"/>
      <!-- DENSE CLOUD LAYER OBSCURING TOP NORTH-WEST (Optical Limitation) -->
      <ellipse cx="180" cy="140" rx="170" ry="110" fill="url(#cloudGrad)"/>
      <ellipse cx="280" cy="90" rx="140" ry="80" fill="url(#cloudGrad)"/>
      <ellipse cx="90" cy="210" rx="90" ry="60" fill="url(#cloudGrad)"/>
      <rect x="15" y="15" width="280" height="28" rx="4" fill="#0f172a" opacity="0.85"/>
      <text x="25" y="34" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">OPTICAL (S2): CLOUD COVER 38%</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  }

  // SAR (Sentinel-1 C-Band VV/VH Synthetic Aperture Radar)
  // Microwave penetration: Water is specular reflection (black/dark), clouds are transparent, urban structures have high double-bounce backscatter (bright white/yellow)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <filter id="sarSpeckle">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.25 0"/>
        <feBlend in="SourceGraphic" in2="noise" mode="screen"/>
      </filter>
      <pattern id="sarNoise" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="#1c2430"/>
        <circle cx="3" cy="5" r="1.2" fill="#475569"/>
        <circle cx="12" cy="14" r="1.5" fill="#64748b"/>
        <circle cx="17" cy="6" r="1" fill="#334155"/>
      </pattern>
    </defs>
    <!-- Background microwave terrain backscatter -->
    <rect width="600" height="600" fill="url(#sarNoise)"/>
    <!-- WATER BODY (Zero microwave backscatter - Specular Reflection = PURE DARKNESS, NO CLOUDS!) -->
    <path d="M50,150 Q200,100 250,250 T150,550 T50,600 Z" fill="#05080f"/>
    <!-- URBAN BUILT-UP REGION (High Cardinal Double-Bounce Backscatter = BRIGHT INTENSITY) -->
    <rect x="300" y="200" width="280" height="380" fill="#cbd5e1" opacity="0.85"/>
    <circle cx="420" cy="350" r="45" fill="#f8fafc"/>
    <circle cx="360" cy="480" r="30" fill="#f8fafc"/>
    <rect x="460" y="240" width="90" height="120" fill="#f1f5f9"/>
    <!-- Cloud zone completely invisible to radar; underlying terrain revealed -->
    <path d="M60,40 L280,30 L220,130 Z" fill="#334155" opacity="0.6"/>
    <!-- Radar beam / polarization tag -->
    <rect x="15" y="15" width="280" height="28" rx="4" fill="#0f172a" opacity="0.85"/>
    <text x="25" y="34" fill="#22d3ee" font-family="monospace" font-size="12" font-weight="bold">SAR (S1 C-BAND): VV/VH BACKSCATTER</text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

export const SAMPLE_DATASETS: Record<string, ImageMetadata[]> = {
  'single_harbor': [
    {
      id: 'img-sample-harbor',
      filename: 'S2A_MSIL2A_20240218_Visakhapatnam_Port.tif',
      format: 'GeoTIFF',
      width: 600,
      height: 600,
      resolutionGsd: '10 m (Sentinel-2 VNIR)',
      modality: 'Multispectral (B4, B3, B2, B8 NIR)',
      bands: '12 Bands (B1-B12, Level-2A BOA Reflectance)',
      coordinateSystem: 'WGS 84 / UTM Zone 44N (EPSG:32644)',
      bounds: [17.682, 83.275, 17.728, 83.324],
      acquisitionDate: '2024-02-18T05:12:44Z',
      cloudCover: '0.4%',
      spatialAlignmentOk: true,
      dataUrl: createSatelliteSvgDataUrl('port'),
      role: 'single'
    }
  ],
  'single_suburban': [
    {
      id: 'img-sample-suburban',
      filename: 'BigEarthNet_S2_Patch_Hyderabad_East.tif',
      format: 'GeoTIFF',
      width: 600,
      height: 600,
      resolutionGsd: '10 m',
      modality: 'Sentinel-2 Multispectral',
      bands: 'RGB + NIR (B4, B3, B2, B8)',
      coordinateSystem: 'WGS 84 / UTM Zone 44N (EPSG:32644)',
      bounds: [17.385, 78.486, 17.445, 78.552],
      acquisitionDate: '2023-11-04T05:30:10Z',
      cloudCover: '1.2%',
      spatialAlignmentOk: true,
      dataUrl: createSatelliteSvgDataUrl('urban'),
      role: 'single'
    }
  ],
  'bitemporal_expansion': [
    {
      id: 'img-t1-expansion',
      filename: 'Sentinel2_LEVIR_T1_20210312.tif',
      format: 'GeoTIFF',
      width: 600,
      height: 600,
      resolutionGsd: '10 m',
      modality: 'Optical Multispectral',
      bands: 'B4-B3-B2 True Color',
      coordinateSystem: 'WGS 84 / UTM Zone 43N (EPSG:32643)',
      bounds: [12.971, 77.594, 13.025, 77.658],
      acquisitionDate: '2021-03-12',
      cloudCover: '0.0%',
      spatialAlignmentOk: true,
      dataUrl: createSatelliteSvgDataUrl('t1'),
      role: 't1'
    },
    {
      id: 'img-t2-expansion',
      filename: 'Sentinel2_LEVIR_T2_20240310.tif',
      format: 'GeoTIFF',
      width: 600,
      height: 600,
      resolutionGsd: '10 m',
      modality: 'Optical Multispectral',
      bands: 'B4-B3-B2 True Color',
      coordinateSystem: 'WGS 84 / UTM Zone 43N (EPSG:32643)',
      bounds: [12.971, 77.594, 13.025, 77.658],
      acquisitionDate: '2024-03-10',
      cloudCover: '0.2%',
      spatialAlignmentOk: true,
      temporalDelta: '3 Years (35 Months)',
      dataUrl: createSatelliteSvgDataUrl('t2'),
      role: 't2'
    }
  ],
  'optical_sar_fusion': [
    {
      id: 'img-optical-flood',
      filename: 'S2_MSIL2A_Brahmaputra_Optical.tif',
      format: 'GeoTIFF',
      width: 600,
      height: 600,
      resolutionGsd: '10 m',
      modality: 'Sentinel-2 L2A Multispectral',
      bands: '12 Spectral Bands (VNIR/SWIR)',
      coordinateSystem: 'WGS 84 / UTM Zone 46N (EPSG:32646)',
      bounds: [26.144, 91.736, 26.210, 91.810],
      acquisitionDate: '2023-08-14',
      cloudCover: '38.4% (Dense cumulus haze)',
      spatialAlignmentOk: true,
      dataUrl: createSatelliteSvgDataUrl('optical'),
      role: 'optical'
    },
    {
      id: 'img-sar-flood',
      filename: 'S1_GRD_IW_VV_VH_Brahmaputra_SAR.tif',
      format: 'GeoTIFF',
      width: 600,
      height: 600,
      resolutionGsd: '10 m (Resampled)',
      modality: 'Sentinel-1 C-Band SAR (Synthetic Aperture Radar)',
      bands: 'Dual-Polarization (VV + VH Backscatter Amplitude)',
      coordinateSystem: 'WGS 84 / UTM Zone 46N (EPSG:32646)',
      bounds: [26.144, 91.736, 26.210, 91.810],
      acquisitionDate: '2023-08-14',
      cloudCover: '0.0% (Radar microwave cloud-invariant)',
      spatialAlignmentOk: true,
      dataUrl: createSatelliteSvgDataUrl('sar'),
      role: 'sar'
    }
  ]
};
