/**
 * Layers shared across showstyles, to maintain compatibility with config tables.
 */

export enum GraphicLLayer {
	GraphicLLayerOverlay = 'graphic_overlay', // <= viz_layer_overlay
	GraphicLLayerOverlayIdent = 'graphic_overlay_ident', // <= viz_layer_overlay_ident
	GraphicLLayerOverlayTopt = 'graphic_overlay_topt', // <= viz_layer_overlay_topt
	GraphicLLayerOverlayLower = 'graphic_overlay_lower', // <= viz_layer_overlay_lower
	GraphicLLayerOverlayHeadline = 'graphic_overlay_headline', // <= viz_layer_overlay_headline
	GraphicLLayerOverlayTema = 'graphic_overlay_tema', // <= viz_layer_overlay_tema
	GraphicLLayerPilot = 'graphic_pilot', // <= viz_layer_pilot
	GraphicLLayerPilotOverlay = 'graphic_pilot_overlay', // <= viz_layer_pilot_overlay
	GraphicLLayerDesign = 'graphic_design', // <= viz_layer_design
	GraphicLLayerFullLoop = 'graphic_full_loop',
	GraphicLLayerAdLibs = 'graphic_adlibs', // <= viz_layer_adlibs
	GraphicLLayerWall = 'graphic_wall' // <= viz_layer_wall
}

export enum AbstractLLayer {
	ServerEnablePending = 'server_enable_pending',
	/* Exists to give the Ident UI marker a timeline object so that it gets the startedPlayback callback */
	IdentMarker = 'ident_marker'
}

export function SisyfosEVSSource(i: number | string) {
	return `sisyfos_source_evs_${i}`
}

export function AbstractLLayerServerEnable(i: number) {
	return `server_enable_${i}`
}
