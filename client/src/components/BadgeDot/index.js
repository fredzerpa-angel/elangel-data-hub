import { forwardRef } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import pxToRem from "assets/theme/functions/pxToRem";

const BadgeDot = forwardRef(({color, size, content, font, variant, children, ...rest}, ref) => {
  
  const sizes = {
    dot: {
      xs: pxToRem(6),
      sm: pxToRem(7),
      md: pxToRem(8),
      lg: pxToRem(9),
    },
    content: {
      xs: "regular",
      sm: "regular",
      md: "small",
      lg: "medium",
    },
  };
	return (
    <SoftBox display="flex" alignItems="center" ref={ref} {...rest}>
      <SoftBox
        bgColor={color}
        variant={variant}
        sx={{
          width: sizes.dot[size],
          height: sizes.dot[size],
          borderRadius: '50%',
        }}
        mr={1}
      />
      {typeof content === 'string' ? (
        <SoftTypography
          variant="caption"
          color={font.color}
          fontWeight={font.weight}
          fontSize={sizes.content[size]}
        >
          {content}
        </SoftTypography>
      ) : (
        content
      )}
    </SoftBox>
  );
})

BadgeDot.defaultProps = {
	color: "info",
	size: "xs",
	font: {},
	variant: "contained",
}

BadgeDot.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  content: PropTypes.node.isRequired,
  font: PropTypes.shape({ color: PropTypes.string, weight: PropTypes.string }),
  variant: PropTypes.oneOf(['gradient', 'contained']),
};

export default BadgeDot;