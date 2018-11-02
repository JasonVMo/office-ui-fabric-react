export interface ISpace {
  margin?: number;
  padding?: number;
  // TODO: there is likely much more to be filled in
}

/**
 * I know one might ponder how the amazing name of this interface was arrived at, but
 * shockingly enough it was simply pure laziness.  (Just putting some stuff in here
 * until it can be appropriately organized)
 */
export interface IOtherProps {
  iconWeight?: number;
  borderRadius?: number | string;
  borderWidth?: number | string;
  contentPadding?: number | string;
  width?: number | string;
  height?: number | string;
  iconSize?: number | string;
  lineHeight?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
}
