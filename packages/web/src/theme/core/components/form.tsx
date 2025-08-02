import type { Theme, Components } from '@mui/material/styles';

import { formLabelClasses } from '@mui/material/FormLabel';
import { inputLabelClasses } from '@mui/material/InputLabel';

import { getInputTypography } from './text-field';

// ----------------------------------------------------------------------

const MuiFormControl: Components<Theme>['MuiFormControl'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    variant: 'outlined',
    size: 'small',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      // Add spacing between label and input
      '& .MuiInputLabel-root': {
        position: 'static',
        transform: 'none',
        marginBottom: theme.spacing(1),
        fontSize: theme.typography.pxToRem(14),
        fontWeight: theme.typography.fontWeightMedium,
        color: theme.vars.palette.text.primary,
        '&.Mui-focused': {
          color: theme.vars.palette.text.primary,
        },
        '&.Mui-error': {
          color: theme.vars.palette.error.main,
        },
        '&.Mui-disabled': {
          color: theme.vars.palette.text.disabled,
        },
      },
      // Remove notch for outlined fields since labels are now above
      '& .MuiOutlinedInput-notchedOutline legend': {
        display: 'none',
      },
    }),
  },
};

/**
 * Applies label styles to TextField and Select.
 */
const MuiInputLabel: Components<Theme>['MuiInputLabel'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      variants: [
        {
          props: (props) => !props.shrink,
          style: {
            ...getInputTypography(theme, ['fontSize', 'lineHeight']),
            color: theme.vars.palette.text.disabled,
          },
        },
        {
          props: (props) => !!props.shrink,
          style: {
            fontWeight: theme.typography.fontWeightSemiBold,
            [`&.${inputLabelClasses.focused}:not(.${inputLabelClasses.error})`]: {
              color: 'inherit',
            },
          },
        },
        {
          props: (props) => !!props.shrink && props.variant === 'filled' && props.size === 'medium',
          style: {
            transform: 'translate(12px, 6px) scale(0.75)',
          },
        },
      ],
    }),
  },
};

/**
 * Applies label styles to Checkbox, RadioGroup, Switch.
 */
const MuiFormLabel: Components<Theme>['MuiFormLabel'] = {
  //   // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      [`&.${formLabelClasses.disabled}`]: {
        color: theme.vars.palette.action.disabled,
      },
      variants: [
        {
          props: (props) => !props.error,
          style: {
            [`&.${formLabelClasses.focused}`]: {
              color: theme.vars.palette.text.secondary,
            },
          },
        },
      ],
    }),
  },
};

const MuiFormControlLabel: Components<Theme>['MuiFormControlLabel'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    label: ({ theme }) => ({
      ...theme.typography.body2,
    }),
  },
};

const MuiFormHelperText: Components<Theme>['MuiFormHelperText'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    component: 'div',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
      margin: theme.spacing(0.75, 1.5, 0, 1.5),
      '& > svg': { width: 16, height: 16 },
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const form: Components<Theme> = {
  MuiFormLabel,
  MuiInputLabel,
  MuiFormControl,
  MuiFormHelperText,
  MuiFormControlLabel,
};
