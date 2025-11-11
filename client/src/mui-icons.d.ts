declare module '@mui/icons-material' {
  import { SvgIconProps } from '@mui/material/SvgIcon';
  import { FC } from 'react';

  export const Visibility: FC<SvgIconProps>;
  export const VisibilityOff: FC<SvgIconProps>;
  export const Email: FC<SvgIconProps>;
  export const Lock: FC<SvgIconProps>;
  export const TrendingUp: FC<SvgIconProps>;
  export const LogoutOutlined: FC<SvgIconProps>;
}

declare module '@mui/icons-material/Menu' {
  import { SvgIconProps } from '@mui/material/SvgIcon';
  import { FC } from 'react';
  
  const MenuIcon: FC<SvgIconProps>;
  export default MenuIcon;
}

declare module '@mui/icons-material/Add' {
  import { SvgIconProps } from '@mui/material/SvgIcon';
  import { FC } from 'react';
  
  const AddIcon: FC<SvgIconProps>;
  export default AddIcon;
}

declare module '@mui/icons-material/Close' {
  import { SvgIconProps } from '@mui/material/SvgIcon';
  import { FC } from 'react';
  
  const CloseIcon: FC<SvgIconProps>;
  export default CloseIcon;
}
