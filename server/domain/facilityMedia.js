/**
 * Centralized Facility Media Registry for FaCICuSe (CICS Building).
 *
 * Single source of truth for default facility imagery and per-facility photo overrides.
 * To assign a client-approved photograph to any specific CICS space without touching UI code,
 * add its unique facility code to FACILITY_IMAGE_BY_CODE below or update the facility's
 * imageUrl directly through Admin -> Manage Facilities.
 */

export const DEFAULT_FACILITY_MEDIA = Object.freeze({
  classroom: '/assets/images/cics-classroom.jpg',
  laboratory: '/assets/images/cics-lab.jpg',
  smartRoom: '/assets/images/cics-smart-room.jpg',
  building: '/assets/images/cics-building.jpg',
});

export const FACILITY_MEDIA_PRESETS = Object.freeze([
  Object.freeze({
    id: 'classroom',
    label: 'CICS Classroom (Provisional Placeholder)',
    value: DEFAULT_FACILITY_MEDIA.classroom,
  }),
  Object.freeze({
    id: 'laboratory',
    label: 'Computer / Technical Laboratory (Provisional Placeholder)',
    value: DEFAULT_FACILITY_MEDIA.laboratory,
  }),
  Object.freeze({
    id: 'smartRoom',
    label: 'SMART Classroom / Office (Provisional Placeholder)',
    value: DEFAULT_FACILITY_MEDIA.smartRoom,
  }),
  Object.freeze({
    id: 'building',
    label: 'CICS Building Exterior / Support (Provisional Placeholder)',
    value: DEFAULT_FACILITY_MEDIA.building,
  }),
]);

/**
 * Optional per-facility image overrides keyed by canonical facility code (e.g. 'CICS-101').
 * Leave entries unset to use the category/type default until client-verified room photos arrive.
 */
export const FACILITY_IMAGE_BY_CODE = Object.freeze({});

export function resolveFacilityImageUrl({ code, category, imageUrl } = {}) {
  const custom = String(imageUrl || '').trim();
  if (custom) return custom;

  const normalizedCode = String(code || '').trim().toUpperCase();
  if (normalizedCode && FACILITY_IMAGE_BY_CODE[normalizedCode]) {
    return FACILITY_IMAGE_BY_CODE[normalizedCode];
  }

  if (category === 'Administrative') return DEFAULT_FACILITY_MEDIA.smartRoom;
  if (category === 'Support') return DEFAULT_FACILITY_MEDIA.building;
  return DEFAULT_FACILITY_MEDIA.classroom;
}
