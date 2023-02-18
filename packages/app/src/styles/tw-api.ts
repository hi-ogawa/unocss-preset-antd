//
// AUTO-GENERATED
//

type Property = RuleStatic | RuleDynamic | Shortcut;
type Method = Variant;

type ApiProperty = {
  [key in Property]: Api;
};

type ApiMethod = {
  [key in Method]: (inner: Api) => Api;
};

// escape hatch to allow arbitrary values which are not supported by auto-generation
type ApiCustom = {
  _: (raw: string) => Api; // for rule
  _v: (raw: string, inner: Api) => Api; // for variant
};

// force special property to dump the resulting class string,
// which allows transform to be implemented trivially via regex
type ApiToString = {
  $: string;
};

export type Api = ApiProperty & ApiMethod & ApiCustom & ApiToString;


//
// constants based on unocss config
//

export type Theme_aria =
  | `invalid`
  | `busy`
  | `checked`
  | `disabled`
  | `expanded`
  | `hidden`
  | `pressed`
  | `readonly`
  | `required`
  | `selected`
  | `current_page`
;

export type Theme_colors =
  | `colorPrimary`
  | `colorSuccess`
  | `colorWarning`
  | `colorError`
  | `colorInfo`
  | `colorTextBase`
  | `colorBgBase`
  | `colorText`
  | `colorTextSecondary`
  | `colorTextTertiary`
  | `colorTextQuaternary`
  | `colorFill`
  | `colorFillSecondary`
  | `colorFillTertiary`
  | `colorFillQuaternary`
  | `colorBgLayout`
  | `colorBgContainer`
  | `colorBgElevated`
  | `colorBgSpotlight`
  | `colorBorder`
  | `colorBorderSecondary`
  | `colorPrimaryBg`
  | `colorPrimaryBgHover`
  | `colorPrimaryBorder`
  | `colorPrimaryBorderHover`
  | `colorPrimaryHover`
  | `colorPrimaryActive`
  | `colorPrimaryTextHover`
  | `colorPrimaryText`
  | `colorPrimaryTextActive`
  | `colorSuccessBg`
  | `colorSuccessBgHover`
  | `colorSuccessBorder`
  | `colorSuccessBorderHover`
  | `colorSuccessHover`
  | `colorSuccessActive`
  | `colorSuccessTextHover`
  | `colorSuccessText`
  | `colorSuccessTextActive`
  | `colorErrorBg`
  | `colorErrorBgHover`
  | `colorErrorBorder`
  | `colorErrorBorderHover`
  | `colorErrorHover`
  | `colorErrorActive`
  | `colorErrorTextHover`
  | `colorErrorText`
  | `colorErrorTextActive`
  | `colorWarningBg`
  | `colorWarningBgHover`
  | `colorWarningBorder`
  | `colorWarningBorderHover`
  | `colorWarningHover`
  | `colorWarningActive`
  | `colorWarningTextHover`
  | `colorWarningText`
  | `colorWarningTextActive`
  | `colorInfoBg`
  | `colorInfoBgHover`
  | `colorInfoBorder`
  | `colorInfoBorderHover`
  | `colorInfoHover`
  | `colorInfoActive`
  | `colorInfoTextHover`
  | `colorInfoText`
  | `colorInfoTextActive`
  | `colorBgMask`
  | `colorWhite`
  | `colorLink`
  | `colorLinkHover`
  | `colorLinkActive`
  | `colorFillContent`
  | `colorFillContentHover`
  | `colorFillAlter`
  | `colorBgContainerDisabled`
  | `colorBorderBg`
  | `colorSplit`
  | `colorTextPlaceholder`
  | `colorTextDisabled`
  | `colorTextHeading`
  | `colorTextLabel`
  | `colorTextDescription`
  | `colorTextLightSolid`
  | `colorHighlight`
  | `colorBgTextHover`
  | `colorBgTextActive`
  | `colorIcon`
  | `colorIconHover`
  | `colorErrorOutline`
  | `colorWarningOutline`
  | `inherit`
  | `current`
  | `transparent`
  | `black`
  | `white`
;

export type Theme_width =
  | `auto`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_height =
  | `auto`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_maxWidth =
  | `none`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_maxHeight =
  | `none`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_minWidth =
  | `none`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_minHeight =
  | `none`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_inlineSize =
  | `auto`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_blockSize =
  | `auto`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_maxInlineSize =
  | `none`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_maxBlockSize =
  | `none`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_minInlineSize =
  | `none`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_minBlockSize =
  | `none`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
  | `screen`
;

export type Theme_fontFamily =
  | `sans`
  | `serif`
  | `mono`
;

export type Theme_fontSize =
  | `xs`
  | `sm`
  | `base`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `8xl`
  | `9xl`
;

export type Theme_breakpoints =
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
;

export type Theme_verticalBreakpoints =
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
;

export type Theme_borderRadius =
  | `DEFAULT`
  | `none`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `full`
;

export type Theme_lineHeight =
  | `none`
  | `tight`
  | `snug`
  | `normal`
  | `relaxed`
  | `loose`
;

export type Theme_letterSpacing =
  | `tighter`
  | `tight`
  | `normal`
  | `wide`
  | `wider`
  | `widest`
;

export type Theme_wordSpacing =
  | `tighter`
  | `tight`
  | `normal`
  | `wide`
  | `wider`
  | `widest`
;

export type Theme_boxShadow =
  | `DEFAULT`
  | `none`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `inner`
;

export type Theme_textIndent =
  | `DEFAULT`
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
;

export type Theme_textShadow =
  | `DEFAULT`
  | `none`
  | `sm`
  | `md`
  | `lg`
  | `xl`
;

export type Theme_textStrokeWidth =
  | `DEFAULT`
  | `none`
  | `sm`
  | `md`
  | `lg`
;

export type Theme_blur =
  | `0`
  | `DEFAULT`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
;

export type Theme_dropShadow =
  | `DEFAULT`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `none`
;

export type Theme_easing =
  | `DEFAULT`
  | `linear`
  | `in`
  | `out`
  | `in_out`
;

export type Theme_lineWidth =
  | `DEFAULT`
  | `none`
;

export type Theme_spacing =
  | `DEFAULT`
  | `none`
  | `xs`
  | `sm`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `8xl`
  | `9xl`
;

export type Theme_duration =
  | `75`
  | `100`
  | `150`
  | `200`
  | `300`
  | `500`
  | `700`
  | `1000`
  | `DEFAULT`
  | `none`
;

export type Theme_ringWidth =
  | `DEFAULT`
  | `none`
;

export type Theme_preflightBase =
  | `__un_rotate`
  | `__un_rotate_x`
  | `__un_rotate_y`
  | `__un_rotate_z`
  | `__un_scale_x`
  | `__un_scale_y`
  | `__un_scale_z`
  | `__un_skew_x`
  | `__un_skew_y`
  | `__un_translate_x`
  | `__un_translate_y`
  | `__un_translate_z`
  | `__un_pan_x`
  | `__un_pan_y`
  | `__un_pinch_zoom`
  | `__un_scroll_snap_strictness`
  | `__un_ordinal`
  | `__un_slashed_zero`
  | `__un_numeric_figure`
  | `__un_numeric_spacing`
  | `__un_numeric_fraction`
  | `__un_border_spacing_x`
  | `__un_border_spacing_y`
  | `__un_ring_offset_shadow`
  | `__un_ring_shadow`
  | `__un_shadow_inset`
  | `__un_shadow`
  | `__un_ring_inset`
  | `__un_ring_offset_width`
  | `__un_ring_offset_color`
  | `__un_ring_width`
  | `__un_ring_color`
  | `__un_blur`
  | `__un_brightness`
  | `__un_contrast`
  | `__un_drop_shadow`
  | `__un_grayscale`
  | `__un_hue_rotate`
  | `__un_invert`
  | `__un_saturate`
  | `__un_sepia`
  | `__un_backdrop_blur`
  | `__un_backdrop_brightness`
  | `__un_backdrop_contrast`
  | `__un_backdrop_grayscale`
  | `__un_backdrop_hue_rotate`
  | `__un_backdrop_invert`
  | `__un_backdrop_opacity`
  | `__un_backdrop_saturate`
  | `__un_backdrop_sepia`
;

export type Theme_containers =
  | `xs`
  | `sm`
  | `md`
  | `lg`
  | `xl`
  | `2xl`
  | `3xl`
  | `4xl`
  | `5xl`
  | `6xl`
  | `7xl`
  | `prose`
;

export type Theme_animation_keyframes =
  | `pulse`
  | `bounce`
  | `spin`
  | `ping`
  | `bounce_alt`
  | `flash`
  | `pulse_alt`
  | `rubber_band`
  | `shake_x`
  | `shake_y`
  | `head_shake`
  | `swing`
  | `tada`
  | `wobble`
  | `jello`
  | `heart_beat`
  | `hinge`
  | `jack_in_the_box`
  | `light_speed_in_left`
  | `light_speed_in_right`
  | `light_speed_out_left`
  | `light_speed_out_right`
  | `flip`
  | `flip_in_x`
  | `flip_in_y`
  | `flip_out_x`
  | `flip_out_y`
  | `rotate_in`
  | `rotate_in_down_left`
  | `rotate_in_down_right`
  | `rotate_in_up_left`
  | `rotate_in_up_right`
  | `rotate_out`
  | `rotate_out_down_left`
  | `rotate_out_down_right`
  | `rotate_out_up_left`
  | `rotate_out_up_right`
  | `roll_in`
  | `roll_out`
  | `zoom_in`
  | `zoom_in_down`
  | `zoom_in_left`
  | `zoom_in_right`
  | `zoom_in_up`
  | `zoom_out`
  | `zoom_out_down`
  | `zoom_out_left`
  | `zoom_out_right`
  | `zoom_out_up`
  | `bounce_in`
  | `bounce_in_down`
  | `bounce_in_left`
  | `bounce_in_right`
  | `bounce_in_up`
  | `bounce_out`
  | `bounce_out_down`
  | `bounce_out_left`
  | `bounce_out_right`
  | `bounce_out_up`
  | `slide_in_down`
  | `slide_in_left`
  | `slide_in_right`
  | `slide_in_up`
  | `slide_out_down`
  | `slide_out_left`
  | `slide_out_right`
  | `slide_out_up`
  | `fade_in`
  | `fade_in_down`
  | `fade_in_down_big`
  | `fade_in_left`
  | `fade_in_left_big`
  | `fade_in_right`
  | `fade_in_right_big`
  | `fade_in_up`
  | `fade_in_up_big`
  | `fade_in_top_left`
  | `fade_in_top_right`
  | `fade_in_bottom_left`
  | `fade_in_bottom_right`
  | `fade_out`
  | `fade_out_down`
  | `fade_out_down_big`
  | `fade_out_left`
  | `fade_out_left_big`
  | `fade_out_right`
  | `fade_out_right_big`
  | `fade_out_up`
  | `fade_out_up_big`
  | `fade_out_top_left`
  | `fade_out_top_right`
  | `fade_out_bottom_left`
  | `fade_out_bottom_right`
  | `back_in_up`
  | `back_in_down`
  | `back_in_right`
  | `back_in_left`
  | `back_out_up`
  | `back_out_down`
  | `back_out_right`
  | `back_out_left`
;

export type Theme_animation_durations =
  | `pulse`
  | `heart_beat`
  | `bounce_in`
  | `bounce_out`
  | `flip_out_x`
  | `flip_out_y`
  | `hinge`
;

export type Theme_animation_timingFns =
  | `pulse`
  | `ping`
  | `head_shake`
  | `heart_beat`
  | `pulse_alt`
  | `light_speed_in_left`
  | `light_speed_in_right`
  | `light_speed_out_left`
  | `light_speed_out_right`
;

export type Theme_animation_properties =
  | `bounce_alt`
  | `jello`
  | `swing`
  | `flip`
  | `flip_in_x`
  | `flip_in_y`
  | `flip_out_x`
  | `flip_out_y`
  | `rotate_in`
  | `rotate_in_down_left`
  | `rotate_in_down_right`
  | `rotate_in_up_left`
  | `rotate_in_up_right`
  | `rotate_out`
  | `rotate_out_down_left`
  | `rotate_out_down_right`
  | `rotate_out_up_left`
  | `rotate_out_up_right`
  | `hinge`
  | `zoom_out_down`
  | `zoom_out_left`
  | `zoom_out_right`
  | `zoom_out_up`
;

export type Theme_animation_counts =
  | `spin`
  | `ping`
  | `pulse`
  | `pulse_alt`
  | `bounce`
  | `bounce_alt`
;

export type Theme_media =
  | `portrait`
  | `landscape`
  | `os_dark`
  | `os_light`
  | `motion_ok`
  | `motion_not_ok`
  | `high_contrast`
  | `low_contrast`
  | `opacity_ok`
  | `opacity_not_ok`
  | `useData_ok`
  | `useData_not_ok`
  | `touch`
  | `stylus`
  | `pointer`
  | `mouse`
  | `hd_color`
;

export type Theme_supports =
  | `grid`
;

export type Autocomplete_num =
  | `0`
  | `1`
  | `2`
  | `3`
  | `4`
  | `5`
  | `6`
  | `8`
  | `10`
  | `12`
  | `24`
  | `36`
;

export type Autocomplete_percent =
  | `0`
  | `10`
  | `20`
  | `30`
  | `40`
  | `50`
  | `60`
  | `70`
  | `80`
  | `90`
  | `100`
;

export type Autocomplete_directions =
  | `x`
  | `y`
  | `t`
  | `b`
  | `l`
  | `r`
;

export type RuleStatic =
  | `sr_only`
  | `not_sr_only`
  | `pointer_events_auto`
  | `pointer_events_none`
  | `pointer_events_inherit`
  | `pointer_events_initial`
  | `pointer_events_revert`
  | `pointer_events_revert_layer`
  | `pointer_events_unset`
  | `visible`
  | `invisible`
  | `backface_visible`
  | `backface_hidden`
  | `backface_inherit`
  | `backface_initial`
  | `backface_revert`
  | `backface_revert_layer`
  | `backface_unset`
  | `line_clamp_none`
  | `line_clamp_inherit`
  | `line_clamp_initial`
  | `line_clamp_revert`
  | `line_clamp_revert_layer`
  | `line_clamp_unset`
  | `isolate`
  | `isolate_auto`
  | `isolation_auto`
  | `order_first`
  | `order_last`
  | `order_none`
  | `grid`
  | `inline_grid`
  | `grid_rows_none`
  | `grid_cols_none`
  | `float_left`
  | `float_right`
  | `float_none`
  | `float_inherit`
  | `float_initial`
  | `float_revert`
  | `float_revert_layer`
  | `float_unset`
  | `clear_left`
  | `clear_right`
  | `clear_both`
  | `clear_none`
  | `clear_inherit`
  | `clear_initial`
  | `clear_revert`
  | `clear_revert_layer`
  | `clear_unset`
  | `box_border`
  | `box_content`
  | `box_inherit`
  | `box_initial`
  | `box_revert`
  | `box_revert_layer`
  | `box_unset`
  | `inline`
  | `block`
  | `inline_block`
  | `contents`
  | `flow_root`
  | `list_item`
  | `hidden`
  | `flex`
  | `inline_flex`
  | `flex_inline`
  | `flex_1`
  | `flex_auto`
  | `flex_initial`
  | `flex_none`
  | `flex_row`
  | `flex_row_reverse`
  | `flex_col`
  | `flex_col_reverse`
  | `flex_wrap`
  | `flex_wrap_reverse`
  | `flex_nowrap`
  | `inline_table`
  | `table`
  | `table_caption`
  | `table_cell`
  | `table_column`
  | `table_column_group`
  | `table_footer_group`
  | `table_header_group`
  | `table_row`
  | `table_row_group`
  | `border_collapse`
  | `border_separate`
  | `caption_top`
  | `caption_bottom`
  | `table_auto`
  | `table_fixed`
  | `table_empty_cells_visible`
  | `table_empty_cells_hidden`
  | `transform`
  | `transform_cpu`
  | `transform_gpu`
  | `transform_none`
  | `transform_inherit`
  | `transform_initial`
  | `transform_revert`
  | `transform_revert_layer`
  | `transform_unset`
  | `animate_none`
  | `animate_inherit`
  | `animate_initial`
  | `animate_revert`
  | `animate_revert_layer`
  | `animate_unset`
  | `cursor_auto`
  | `cursor_default`
  | `cursor_none`
  | `cursor_context_menu`
  | `cursor_help`
  | `cursor_pointer`
  | `cursor_progress`
  | `cursor_wait`
  | `cursor_cell`
  | `cursor_crosshair`
  | `cursor_text`
  | `cursor_vertical_text`
  | `cursor_alias`
  | `cursor_copy`
  | `cursor_move`
  | `cursor_no_drop`
  | `cursor_not_allowed`
  | `cursor_grab`
  | `cursor_grabbing`
  | `cursor_all_scroll`
  | `cursor_col_resize`
  | `cursor_row_resize`
  | `cursor_n_resize`
  | `cursor_e_resize`
  | `cursor_s_resize`
  | `cursor_w_resize`
  | `cursor_ne_resize`
  | `cursor_nw_resize`
  | `cursor_se_resize`
  | `cursor_sw_resize`
  | `cursor_ew_resize`
  | `cursor_ns_resize`
  | `cursor_nesw_resize`
  | `cursor_nwse_resize`
  | `cursor_zoom_in`
  | `cursor_zoom_out`
  | `touch_pinch_zoom`
  | `touch_auto`
  | `touch_manipulation`
  | `touch_none`
  | `touch_inherit`
  | `touch_initial`
  | `touch_revert`
  | `touch_revert_layer`
  | `touch_unset`
  | `select_auto`
  | `select_all`
  | `select_text`
  | `select_none`
  | `select_inherit`
  | `select_initial`
  | `select_revert`
  | `select_revert_layer`
  | `select_unset`
  | `resize_x`
  | `resize_y`
  | `resize`
  | `resize_none`
  | `resize_inherit`
  | `resize_initial`
  | `resize_revert`
  | `resize_revert_layer`
  | `resize_unset`
  | `snap_mandatory`
  | `snap_proximity`
  | `snap_none`
  | `snap_start`
  | `snap_end`
  | `snap_center`
  | `snap_align_none`
  | `snap_normal`
  | `snap_always`
  | `list_outside`
  | `list_inside`
  | `list_none`
  | `list_inherit`
  | `list_initial`
  | `list_revert`
  | `list_revert_layer`
  | `list_unset`
  | `appearance_none`
  | `break_before_auto`
  | `break_before_avoid`
  | `break_before_all`
  | `break_before_avoid_page`
  | `break_before_page`
  | `break_before_left`
  | `break_before_right`
  | `break_before_column`
  | `break_before_inherit`
  | `break_before_initial`
  | `break_before_revert`
  | `break_before_revert_layer`
  | `break_before_unset`
  | `break_inside_auto`
  | `break_inside_avoid`
  | `break_inside_avoid_page`
  | `break_inside_avoid_column`
  | `break_inside_inherit`
  | `break_inside_initial`
  | `break_inside_revert`
  | `break_inside_revert_layer`
  | `break_inside_unset`
  | `break_after_auto`
  | `break_after_avoid`
  | `break_after_all`
  | `break_after_avoid_page`
  | `break_after_page`
  | `break_after_left`
  | `break_after_right`
  | `break_after_column`
  | `break_after_inherit`
  | `break_after_initial`
  | `break_after_revert`
  | `break_after_revert_layer`
  | `break_after_unset`
  | `place_content_center`
  | `place_content_start`
  | `place_content_end`
  | `place_content_between`
  | `place_content_around`
  | `place_content_evenly`
  | `place_content_stretch`
  | `place_content_inherit`
  | `place_content_initial`
  | `place_content_revert`
  | `place_content_revert_layer`
  | `place_content_unset`
  | `place_items_start`
  | `place_items_end`
  | `place_items_center`
  | `place_items_stretch`
  | `place_items_inherit`
  | `place_items_initial`
  | `place_items_revert`
  | `place_items_revert_layer`
  | `place_items_unset`
  | `place_self_auto`
  | `place_self_start`
  | `place_self_end`
  | `place_self_center`
  | `place_self_stretch`
  | `place_self_inherit`
  | `place_self_initial`
  | `place_self_revert`
  | `place_self_revert_layer`
  | `place_self_unset`
  | `content_center`
  | `content_start`
  | `content_end`
  | `content_between`
  | `content_around`
  | `content_evenly`
  | `content_inherit`
  | `content_initial`
  | `content_revert`
  | `content_revert_layer`
  | `content_unset`
  | `items_start`
  | `items_end`
  | `items_center`
  | `items_baseline`
  | `items_stretch`
  | `items_inherit`
  | `items_initial`
  | `items_revert`
  | `items_revert_layer`
  | `items_unset`
  | `self_auto`
  | `self_start`
  | `self_end`
  | `self_center`
  | `self_stretch`
  | `self_baseline`
  | `self_inherit`
  | `self_initial`
  | `self_revert`
  | `self_revert_layer`
  | `self_unset`
  | `justify_start`
  | `justify_end`
  | `justify_center`
  | `justify_between`
  | `justify_around`
  | `justify_evenly`
  | `justify_inherit`
  | `justify_initial`
  | `justify_revert`
  | `justify_revert_layer`
  | `justify_unset`
  | `justify_items_start`
  | `justify_items_end`
  | `justify_items_center`
  | `justify_items_stretch`
  | `justify_items_inherit`
  | `justify_items_initial`
  | `justify_items_revert`
  | `justify_items_revert_layer`
  | `justify_items_unset`
  | `justify_self_auto`
  | `justify_self_start`
  | `justify_self_end`
  | `justify_self_center`
  | `justify_self_stretch`
  | `justify_self_inherit`
  | `justify_self_initial`
  | `justify_self_revert`
  | `justify_self_revert_layer`
  | `justify_self_unset`
  | `divide_solid`
  | `divide_dashed`
  | `divide_dotted`
  | `divide_double`
  | `divide_hidden`
  | `divide_none`
  | `divide_groove`
  | `divide_ridge`
  | `divide_inset`
  | `divide_outset`
  | `divide_inherit`
  | `divide_initial`
  | `divide_revert`
  | `divide_revert_layer`
  | `divide_unset`
  | `overscroll_auto`
  | `overscroll_contain`
  | `overscroll_none`
  | `overscroll_inherit`
  | `overscroll_initial`
  | `overscroll_revert`
  | `overscroll_revert_layer`
  | `overscroll_unset`
  | `overscroll_x_auto`
  | `overscroll_x_contain`
  | `overscroll_x_none`
  | `overscroll_x_inherit`
  | `overscroll_x_initial`
  | `overscroll_x_revert`
  | `overscroll_x_revert_layer`
  | `overscroll_x_unset`
  | `overscroll_y_auto`
  | `overscroll_y_contain`
  | `overscroll_y_none`
  | `overscroll_y_inherit`
  | `overscroll_y_initial`
  | `overscroll_y_revert`
  | `overscroll_y_revert_layer`
  | `overscroll_y_unset`
  | `scroll_auto`
  | `scroll_smooth`
  | `scroll_inherit`
  | `scroll_initial`
  | `scroll_revert`
  | `scroll_revert_layer`
  | `scroll_unset`
  | `truncate`
  | `text_ellipsis`
  | `text_clip`
  | `break_normal`
  | `break_words`
  | `break_all`
  | `break_keep`
  | `bg_none`
  | `box_decoration_slice`
  | `box_decoration_clone`
  | `box_decoration_inherit`
  | `box_decoration_initial`
  | `box_decoration_revert`
  | `box_decoration_revert_layer`
  | `box_decoration_unset`
  | `bg_auto`
  | `bg_cover`
  | `bg_contain`
  | `bg_fixed`
  | `bg_local`
  | `bg_scroll`
  | `bg_clip_border`
  | `bg_clip_content`
  | `bg_clip_padding`
  | `bg_clip_text`
  | `bg_clip_inherit`
  | `bg_clip_initial`
  | `bg_clip_revert`
  | `bg_clip_revert_layer`
  | `bg_clip_unset`
  | `bg_repeat`
  | `bg_no_repeat`
  | `bg_repeat_x`
  | `bg_repeat_y`
  | `bg_repeat_round`
  | `bg_repeat_space`
  | `bg_repeat_inherit`
  | `bg_repeat_initial`
  | `bg_repeat_revert`
  | `bg_repeat_revert_layer`
  | `bg_repeat_unset`
  | `bg_origin_border`
  | `bg_origin_padding`
  | `bg_origin_content`
  | `bg_origin_inherit`
  | `bg_origin_initial`
  | `bg_origin_revert`
  | `bg_origin_revert_layer`
  | `bg_origin_unset`
  | `fill_none`
  | `stroke_cap_square`
  | `stroke_cap_round`
  | `stroke_cap_auto`
  | `stroke_join_arcs`
  | `stroke_join_bevel`
  | `stroke_join_clip`
  | `stroke_join_round`
  | `stroke_join_auto`
  | `stroke_none`
  | `object_cover`
  | `object_contain`
  | `object_fill`
  | `object_scale_down`
  | `object_none`
  | `text_center`
  | `text_left`
  | `text_right`
  | `text_justify`
  | `text_start`
  | `text_end`
  | `text_inherit`
  | `text_initial`
  | `text_revert`
  | `text_revert_layer`
  | `text_unset`
  | `font_synthesis_weight`
  | `font_synthesis_style`
  | `font_synthesis_small_caps`
  | `font_synthesis_none`
  | `case_upper`
  | `case_lower`
  | `case_capital`
  | `case_normal`
  | `case_inherit`
  | `case_initial`
  | `case_revert`
  | `case_revert_layer`
  | `case_unset`
  | `uppercase`
  | `lowercase`
  | `capitalize`
  | `normal_case`
  | `italic`
  | `not_italic`
  | `font_italic`
  | `font_not_italic`
  | `oblique`
  | `not_oblique`
  | `font_oblique`
  | `font_not_oblique`
  | `normal_nums`
  | `underline_solid`
  | `underline_double`
  | `underline_dotted`
  | `underline_dashed`
  | `underline_wavy`
  | `underline_inherit`
  | `underline_initial`
  | `underline_revert`
  | `underline_revert_layer`
  | `underline_unset`
  | `decoration_solid`
  | `decoration_double`
  | `decoration_dotted`
  | `decoration_dashed`
  | `decoration_wavy`
  | `decoration_inherit`
  | `decoration_initial`
  | `decoration_revert`
  | `decoration_revert_layer`
  | `decoration_unset`
  | `no_underline`
  | `decoration_none`
  | `antialiased`
  | `subpixel_antialiased`
  | `hyphens_manual`
  | `hyphens_auto`
  | `hyphens_none`
  | `hyphens_inherit`
  | `hyphens_initial`
  | `hyphens_revert`
  | `hyphens_revert_layer`
  | `hyphens_unset`
  | `write_vertical_right`
  | `write_vertical_left`
  | `write_normal`
  | `write_inherit`
  | `write_initial`
  | `write_revert`
  | `write_revert_layer`
  | `write_unset`
  | `write_orient_mixed`
  | `write_orient_sideways`
  | `write_orient_upright`
  | `write_orient_inherit`
  | `write_orient_initial`
  | `write_orient_revert`
  | `write_orient_revert_layer`
  | `write_orient_unset`
  | `bg_blend_multiply`
  | `bg_blend_screen`
  | `bg_blend_overlay`
  | `bg_blend_darken`
  | `bg_blend_lighten`
  | `bg_blend_color_dodge`
  | `bg_blend_color_burn`
  | `bg_blend_hard_light`
  | `bg_blend_soft_light`
  | `bg_blend_difference`
  | `bg_blend_exclusion`
  | `bg_blend_hue`
  | `bg_blend_saturation`
  | `bg_blend_color`
  | `bg_blend_luminosity`
  | `bg_blend_normal`
  | `bg_blend_inherit`
  | `bg_blend_initial`
  | `bg_blend_revert`
  | `bg_blend_revert_layer`
  | `bg_blend_unset`
  | `mix_blend_multiply`
  | `mix_blend_screen`
  | `mix_blend_overlay`
  | `mix_blend_darken`
  | `mix_blend_lighten`
  | `mix_blend_color_dodge`
  | `mix_blend_color_burn`
  | `mix_blend_hard_light`
  | `mix_blend_soft_light`
  | `mix_blend_difference`
  | `mix_blend_exclusion`
  | `mix_blend_hue`
  | `mix_blend_saturation`
  | `mix_blend_color`
  | `mix_blend_luminosity`
  | `mix_blend_plus_lighter`
  | `mix_blend_normal`
  | `mix_blend_inherit`
  | `mix_blend_initial`
  | `mix_blend_revert`
  | `mix_blend_revert_layer`
  | `mix_blend_unset`
  | `shadow_inset`
  | `outline`
  | `outline_auto`
  | `outline_dashed`
  | `outline_dotted`
  | `outline_double`
  | `outline_hidden`
  | `outline_solid`
  | `outline_groove`
  | `outline_ridge`
  | `outline_inset`
  | `outline_outset`
  | `outline_inherit`
  | `outline_initial`
  | `outline_revert`
  | `outline_revert_layer`
  | `outline_unset`
  | `outline_none`
  | `ring_offset`
  | `ring_inset`
  | `image_render_auto`
  | `image_render_edge`
  | `image_render_pixel`
  | `filter`
  | `backdrop_filter`
  | `filter_none`
  | `backdrop_filter_none`
  | `filter_inherit`
  | `filter_initial`
  | `filter_revert`
  | `filter_revert_layer`
  | `filter_unset`
  | `backdrop_filter_inherit`
  | `backdrop_filter_initial`
  | `backdrop_filter_revert`
  | `backdrop_filter_revert_layer`
  | `backdrop_filter_unset`
  | `transition_none`
  | `transition_inherit`
  | `transition_initial`
  | `transition_revert`
  | `transition_revert_layer`
  | `transition_unset`
  | `content_visibility_visible`
  | `content_visibility_hidden`
  | `content_visibility_auto`
  | `content_visibility_inherit`
  | `content_visibility_initial`
  | `content_visibility_revert`
  | `content_visibility_revert_layer`
  | `content_visibility_unset`
  | `content_empty`
  | `content_none`
;

export type RuleDynamic =
  | `placeholder_opacity`
  | `placeholder_opacity_${Autocomplete_percent}`
  | `placeholder_${Theme_colors}`
  | `intrinsic_size_${Autocomplete_num}`
  | `transition_property_${"inherit" | "initial" | "revert" | "revert_layer" | "unset" | "all" | "colors" | "none" | "opacity" | "shadow" | "transform"}`
  | `transition_ease_${"linear" | "in" | "out" | "in_out" | "DEFAULT"}`
  | `ease_${"linear" | "in" | "out" | "in_out" | "DEFAULT"}`
  | `transition_delay_${Theme_duration}`
  | `delay_${Theme_duration}`
  | `transition_duration_${Theme_duration}`
  | `duration_${Theme_duration}`
  | `transition_${"all" | "colors" | "none" | "opacity" | "shadow" | "transform"}`
  | `${"backdrop" | "filter"}_sepia`
  | `${"backdrop" | "filter"}_sepia_${Autocomplete_percent}`
  | `sepia_${Autocomplete_percent}`
  | `${"backdrop" | "filter"}_saturate`
  | `${"backdrop" | "filter"}_saturate_${Autocomplete_percent}`
  | `saturate_${Autocomplete_percent}`
  | `backdrop_opacity`
  | `backdrop_opacity_${Autocomplete_percent}`
  | `${"backdrop" | "filter"}_invert`
  | `${"backdrop" | "filter"}_invert_${Autocomplete_percent}`
  | `invert_${Autocomplete_percent}`
  | `${"backdrop" | "filter"}_grayscale`
  | `${"backdrop" | "filter"}_grayscale_${Autocomplete_percent}`
  | `grayscale_${Autocomplete_percent}`
  | `filter_drop`
  | `filter_drop_shadow`
  | `filter_drop_shadow_color`
  | `drop_shadow`
  | `drop_shadow_color`
  | `filter_drop_shadow_${Theme_dropShadow}`
  | `drop_shadow_${Theme_dropShadow}`
  | `filter_drop_shadow_color_${Theme_colors}`
  | `drop_shadow_color_${Theme_colors}`
  | `filter_drop_shadow_color_opacity`
  | `drop_shadow_color_opacity`
  | `filter_drop_shadow_color_opacity_${Autocomplete_percent}`
  | `drop_shadow_color_opacity_${Autocomplete_percent}`
  | `${"backdrop" | "filter"}_contrast_${Autocomplete_percent}`
  | `contrast_${Autocomplete_percent}`
  | `${"backdrop" | "filter"}_brightness_${Autocomplete_percent}`
  | `brightness_${Autocomplete_percent}`
  | `${"backdrop" | "filter"}_blur_${Theme_blur}`
  | `blur_${Theme_blur}`
  | `ring_offset_opacity_${Autocomplete_percent}`
  | `ring_offset_${Theme_colors}`
  | `ring_opacity_${Autocomplete_percent}`
  | `ring_${Theme_colors}`
  | `ring_offset_${"width" | "size"}_${Theme_lineWidth}`
  | `ring_${"width" | "size"}_${Theme_lineWidth}`
  | `ring_${Theme_ringWidth}`
  | `outline_${"offset"}_${Autocomplete_num}`
  | `outline_${Theme_colors}`
  | `outline_${"width" | "size"}_${Autocomplete_num}`
  | `shadow_opacity_${Autocomplete_percent}`
  | `shadow_${Theme_colors}`
  | `shadow_${Theme_boxShadow}`
  | `accent_opacity`
  | `accent_opacity_${Autocomplete_percent}`
  | `accent_${Theme_colors}`
  | `caret_opacity`
  | `caret_opacity_${Autocomplete_percent}`
  | `caret_${Theme_colors}`
  | `text_shadow_color_opacity_${Autocomplete_percent}`
  | `text_shadow_color_${Theme_colors}`
  | `text_shadow_${Theme_textShadow}`
  | `text_stroke_opacity_${Autocomplete_percent}`
  | `text_stroke_${Theme_colors}`
  | `text_stroke_${Theme_textStrokeWidth}`
  | `${"underline" | "decoration"}_${"offset"}_${Autocomplete_num}`
  | `${"underline" | "decoration"}_opacity_${Autocomplete_percent}`
  | `${"underline" | "decoration"}_${Theme_colors}`
  | `${"underline" | "decoration"}_${"auto" | "from_font"}`
  | `${"underline" | "decoration"}_${Autocomplete_num}`
  | `decoration_${"underline" | "overline" | "line_through"}`
  | `text_opacity_${Autocomplete_percent}`
  | `text_${Theme_colors}`
  | `text_${Theme_colors}`
  | `stacked_fractions`
  | `diagonal_fractions`
  | `tabular_nums`
  | `proportional_nums`
  | `oldstyle_nums`
  | `lining_nums`
  | `slashed_zero`
  | `ordinal`
  | `word_spacing_${Theme_wordSpacing}`
  | `tracking_${Theme_letterSpacing}`
  | `${"leading" | "lh"}_${Theme_lineHeight}`
  | `${"font" | "fw"}_${"100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "thin" | "extralight" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black"}`
  | `text_size_${Theme_fontSize}`
  | `text_${Theme_fontSize}`
  | `font_${Theme_fontFamily}`
  | `${"vertical" | "align" | "v"}_${"mid" | "base" | "btm" | "baseline" | "top" | "start" | "middle" | "bottom" | "end" | "text_top" | "text_bottom" | "sub" | "super" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `indent_${Theme_textIndent}`
  | `${"m" | "p"}_${"bs" | "be" | "is" | "ie"}_${Autocomplete_num}`
  | `${"m" | "p"}_${"block" | "inline"}_${Autocomplete_num}`
  | `${"m" | "p"}${Autocomplete_directions}_${Autocomplete_num}`
  | `${"m" | "p"}_${"xy"}`
  | `${"m" | "p"}${Autocomplete_num}`
  | `${"m" | "p"}_${Autocomplete_num}`
  | `object_${"top" | "top_center" | "top_left" | "top_right" | "bottom" | "bottom_center" | "bottom_left" | "bottom_right" | "left" | "left_center" | "left_top" | "left_bottom" | "right" | "right_center" | "right_top" | "right_bottom" | "center" | "center_top" | "center_bottom" | "center_left" | "center_right" | "center_center" | "t" | "tc" | "tl" | "tr" | "b" | "bc" | "bl" | "br" | "l" | "lc" | "lt" | "lb" | "r" | "rc" | "rt" | "rb" | "c" | "ct" | "cb" | "cl" | "cr" | "cc"}`
  | `stroke_opacity_${Autocomplete_percent}`
  | `stroke_${Theme_colors}`
  | `stroke_offset_${Theme_lineWidth}`
  | `stroke_dash_${Autocomplete_num}`
  | `stroke_width_${Theme_lineWidth}`
  | `stroke_size_${Theme_lineWidth}`
  | `fill_opacity_${Autocomplete_percent}`
  | `fill_${Theme_colors}`
  | `bg_gradient_shape`
  | `bg_gradient_shape_${"top" | "top_center" | "top_left" | "top_right" | "bottom" | "bottom_center" | "bottom_left" | "bottom_right" | "left" | "left_center" | "left_top" | "left_bottom" | "right" | "right_center" | "right_top" | "right_bottom" | "center" | "center_top" | "center_bottom" | "center_left" | "center_right" | "center_center" | "t" | "tc" | "tl" | "tr" | "b" | "bc" | "bl" | "br" | "l" | "lc" | "lt" | "lb" | "r" | "rc" | "rt" | "rb" | "c" | "ct" | "cb" | "cl" | "cr" | "cc"}`
  | `shape_${"top" | "top_center" | "top_left" | "top_right" | "bottom" | "bottom_center" | "bottom_left" | "bottom_right" | "left" | "left_center" | "left_top" | "left_bottom" | "right" | "right_center" | "right_top" | "right_bottom" | "center" | "center_top" | "center_bottom" | "center_left" | "center_right" | "center_center" | "t" | "tc" | "tl" | "tr" | "b" | "bc" | "bl" | "br" | "l" | "lc" | "lt" | "lb" | "r" | "rc" | "rt" | "rb" | "c" | "ct" | "cb" | "cl" | "cr" | "cc"}`
  | `bg_gradient_to_${"t" | "tl" | "tr" | "b" | "bl" | "br" | "l" | "lt" | "lb" | "r" | "rt" | "rb"}`
  | `bg_gradient_repeating`
  | `bg_gradient_${"linear" | "radial" | "conic"}`
  | `bg_gradient_repeating_${"linear" | "radial" | "conic"}`
  | `bg_gradient`
  | `bg_gradient_${"from" | "to" | "via"}`
  | `bg_gradient_${"from" | "to" | "via"}_${Theme_colors}`
  | `bg_gradient_${"from" | "to" | "via"}_opacity`
  | `bg_gradient_${"from" | "to" | "via"}_opacity_${Autocomplete_percent}`
  | `bg_opacity_${Autocomplete_percent}`
  | `bg_${Theme_colors}`
  | `border_style`
  | `border_${"solid" | "dashed" | "dotted" | "double" | "hidden" | "none" | "groove" | "ridge" | "inset" | "outset" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `border_${Autocomplete_directions}_style`
  | `border_${Autocomplete_directions}_${"solid" | "dashed" | "dotted" | "double" | "hidden" | "none" | "groove" | "ridge" | "inset" | "outset" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `border_${Autocomplete_directions}_style_${"solid" | "dashed" | "dotted" | "double" | "hidden" | "none" | "groove" | "ridge" | "inset" | "outset" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `border_style_${"solid" | "dashed" | "dotted" | "double" | "hidden" | "none" | "groove" | "ridge" | "inset" | "outset" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `border_${"rounded" | "rd"}`
  | `border_${"rounded" | "rd"}_${Autocomplete_num}`
  | `${"rounded" | "rd"}`
  | `${"rounded" | "rd"}_${Autocomplete_num}`
  | `border_opacity_${Autocomplete_percent}`
  | `border_${Theme_colors}`
  | `border_${Autocomplete_directions}_${Theme_colors}`
  | `border_${Autocomplete_num}`
  | `border_${Autocomplete_directions}_${Autocomplete_num}`
  | `border_${Autocomplete_directions}`
  | `${"whitespace" | "ws"}_${"normal" | "nowrap" | "pre" | "pre_line" | "pre_wrap" | "break_spaces"}`
  | `${"overflow" | "of"}_${"auto" | "hidden" | "clip" | "visible" | "scroll" | "overlay" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `${"overflow" | "of"}_${"x" | "y"}_${"auto" | "hidden" | "clip" | "visible" | "scroll" | "overlay" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `divide_opacity`
  | `divide_opacity_${Autocomplete_percent}`
  | `divide_${Theme_colors}`
  | `divide_${"x" | "y" | "block" | "inline"}`
  | `divide_${"x" | "y" | "block" | "inline"}_reverse`
  | `divide_${"x" | "y" | "block" | "inline"}_${Theme_lineWidth}`
  | `space_${"x" | "y" | "block" | "inline"}`
  | `space_${"x" | "y" | "block" | "inline"}_reverse`
  | `space_${"x" | "y" | "block" | "inline"}_${Theme_spacing}`
  | `gap_${"x" | "y"}_${Theme_spacing}`
  | `gap_${"x" | "y"}_${Autocomplete_num}`
  | `gap_${Theme_spacing}`
  | `gap_${Autocomplete_num}`
  | `columns_${Autocomplete_num}`
  | `list_${"disc" | "circle" | "square" | "decimal" | "zero_decimal" | "greek" | "roman" | "upper_roman" | "alpha" | "upper_alpha" | "latin" | "upper_latin"}`
  | `list_${"disc" | "circle" | "square" | "decimal" | "zero_decimal" | "greek" | "roman" | "upper_roman" | "alpha" | "upper_alpha" | "latin" | "upper_latin"}_${"outside" | "inside"}`
  | `scroll_${"m" | "p" | "ma" | "pa" | "block" | "inline"}`
  | `scroll_${"m" | "p" | "ma" | "pa" | "block" | "inline"}_${Theme_spacing}`
  | `scroll_${"m" | "p" | "ma" | "pa" | "block" | "inline"}_${"x" | "y" | "r" | "l" | "t" | "b" | "bs" | "be" | "is" | "ie"}`
  | `scroll_${"m" | "p" | "ma" | "pa" | "block" | "inline"}_${"x" | "y" | "r" | "l" | "t" | "b" | "bs" | "be" | "is" | "ie"}_${Theme_spacing}`
  | `snap_${"x" | "y" | "both"}`
  | `touch_pan`
  | `touch_pan_${"x" | "left" | "right" | "y" | "up" | "down"}`
  | `animate_${"play" | "state" | "play_state"}`
  | `animate_${"play" | "state" | "play_state"}_${"paused" | "running" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `animate_${"paused" | "running" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `animate_${"iteration" | "count" | "iteration_count"}`
  | `animate_${"iteration" | "count" | "iteration_count"}_${Autocomplete_num}`
  | `animate_direction`
  | `animate_direction_${"normal" | "reverse" | "alternate" | "alternate_reverse" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `animate_${"normal" | "reverse" | "alternate" | "alternate_reverse" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `animate_${"fill" | "mode" | "fill_mode"}`
  | `animate_${"fill" | "mode" | "fill_mode"}_${"none" | "forwards" | "backwards" | "both" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `animate_${"none" | "forwards" | "backwards" | "both" | "inherit" | "initial" | "revert" | "revert_layer" | "unset"}`
  | `animate_delay_${Theme_easing}`
  | `animate_delay`
  | `animate_delay_${Theme_duration}`
  | `animate_duration`
  | `animate_duration_${Theme_duration}`
  | `animate_${Theme_animation_keyframes}`
  | `animate_keyframes_${Theme_animation_keyframes}`
  | `keyframes_${Theme_animation_keyframes}`
  | `transform_${"translate" | "rotate" | "scale"}_${Autocomplete_percent}`
  | `transform_${"translate" | "rotate" | "scale"}_${"x" | "y" | "z"}_${Autocomplete_percent}`
  | `transform_skew_${"x" | "y"}_${Autocomplete_percent}`
  | `transform_origin_${"top" | "top_center" | "top_left" | "top_right" | "bottom" | "bottom_center" | "bottom_left" | "bottom_right" | "left" | "left_center" | "left_top" | "left_bottom" | "right" | "right_center" | "right_top" | "right_bottom" | "center" | "center_top" | "center_bottom" | "center_left" | "center_right" | "center_center" | "t" | "tc" | "tl" | "tr" | "b" | "bc" | "bl" | "br" | "l" | "lc" | "lt" | "lb" | "r" | "rc" | "rt" | "rb" | "c" | "ct" | "cb" | "cl" | "cr" | "cc"}`
  | `origin_${"top" | "top_center" | "top_left" | "top_right" | "bottom" | "bottom_center" | "bottom_left" | "bottom_right" | "left" | "left_center" | "left_top" | "left_bottom" | "right" | "right_center" | "right_top" | "right_bottom" | "center" | "center_top" | "center_bottom" | "center_left" | "center_right" | "center_center" | "t" | "tc" | "tl" | "tr" | "b" | "bc" | "bl" | "br" | "l" | "lc" | "lt" | "lb" | "r" | "rc" | "rt" | "rb" | "c" | "ct" | "cb" | "cl" | "cr" | "cc"}`
  | `border_spacing_${"x" | "y"}`
  | `border_spacing_${"x" | "y"}_${Theme_spacing}`
  | `border_spacing`
  | `border_spacing_${Theme_spacing}`
  | `flex_basis_${Theme_spacing}`
  | `basis_${Theme_spacing}`
  | `flex_grow_${Autocomplete_num}`
  | `grow_${Autocomplete_num}`
  | `flex_shrink_${Autocomplete_num}`
  | `shrink_${Autocomplete_num}`
  | `${"w" | "h"}_screen`
  | `${"min" | "max"}_${"w" | "h"}_screen`
  | `h_screen_${Theme_verticalBreakpoints}`
  | `${"min" | "max"}_h_screen_${Theme_verticalBreakpoints}`
  | `w_screen_${Theme_breakpoints}`
  | `${"min" | "max"}_w_screen_${Theme_breakpoints}`
  | `${"w" | "h"}_${Theme_width}`
  | `${"block" | "inline"}_${Theme_width}`
  | `${"max" | "min"}_${"w" | "h" | "block" | "inline"}`
  | `${"max" | "min"}_${"w" | "h" | "block" | "inline"}_${Theme_width}`
  | `aspect_${"square" | "video" | "ratio"}`
  | `aspect_ratio_${"square" | "video"}`
  | `grid_${"rows" | "cols"}_${Autocomplete_num}`
  | `grid_${"rows" | "cols"}_none`
  | `${"grid_auto_flow" | "auto_flow" | "grid_flow"}_${"row" | "col" | "dense" | "row_dense" | "col_dense"}`
  | `grid_auto_${"rows" | "cols"}_${Autocomplete_num}`
  | `grid_${"row" | "col"}_${"start" | "end"}_${Autocomplete_num}`
  | `grid_${"row" | "col"}_span_${Autocomplete_num}`
  | `${"row" | "col"}_span_${Autocomplete_num}`
  | `z_${Autocomplete_num}`
  | `line_clamp`
  | `line_clamp_${Autocomplete_num}`
  | `${"position" | "pos"}_inset_${Autocomplete_directions}_${Theme_spacing}`
  | `${"position" | "pos"}_inset_${"block" | "inline"}_${Theme_spacing}`
  | `${"position" | "pos"}_inset_${"bs" | "be" | "is" | "ie"}_${Theme_spacing}`
  | `${"position" | "pos"}_${"top" | "left" | "right" | "bottom"}_${Theme_spacing}`
;

export type Variant =
  | `print`
  | `${"at_" | "lt_" | ""}${Theme_breakpoints}`
  | `${"first_letter" | "first_line" | "any_link" | "link" | "visited" | "target" | "open" | "hover" | "active" | "focus_visible" | "focus_within" | "focus" | "autofill" | "enabled" | "disabled" | "read_only" | "read_write" | "placeholder_shown" | "default" | "checked" | "indeterminate" | "valid" | "invalid" | "in_range" | "out_of_range" | "required" | "optional" | "root" | "empty" | "even_of_type" | "even" | "odd_of_type" | "odd" | "first_of_type" | "first" | "last_of_type" | "last" | "only_child" | "only_of_type" | "placeholder" | "before" | "after" | "selection" | "marker" | "file"}`
  | `${"not" | "is" | "where" | "has"}_${"any_link" | "link" | "visited" | "target" | "open" | "hover" | "active" | "focus_visible" | "focus_within" | "focus" | "autofill" | "enabled" | "disabled" | "read_only" | "read_write" | "placeholder_shown" | "default" | "checked" | "indeterminate" | "valid" | "invalid" | "in_range" | "out_of_range" | "required" | "optional" | "root" | "empty" | "even_of_type" | "even" | "odd_of_type" | "odd" | "first_of_type" | "first" | "last_of_type" | "last" | "only_child" | "only_of_type" | ""}`
  | `dark`
  | `light`
  | `rtl`
  | `ltr`
  | `contrast_more`
  | `contrast_less`
  | `landscape`
  | `portrait`
  | `motion_reduce`
  | `motion_safe`
  | `svg`
  | `dark`
  | `light`
  | `dark`
  | `light`
  | `hover`
;

export type Shortcut =
  | `tab`
  | `tablist`
  | `input`
  | `btn_primary`
  | `btn_default`
  | `btn_ghost`
  | `btn_text`
  | `btn`
  | `link`
  | `spin`
  | `reset`
  | `body`
  | `variables_compact`
  | `variables_dark`
  | `variables_default`
;
