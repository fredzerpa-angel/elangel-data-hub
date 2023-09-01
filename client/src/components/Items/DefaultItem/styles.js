import rgba from "assets/theme/functions/rgba";

function menuItem(theme) {
  const { palette, borders, transitions } = theme;

  const { secondary } = palette;
  const { borderRadius } = borders;

  return {
    display: "flex",
    alignItems: "center",
    color: secondary.main,
    borderRadius: borderRadius.md,
    transition: transitions.create("background-color", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    "&:not(:last-child)": {
      mb: 3,
    },

  };
}

function menuIcon(theme, ownerState) {
  const { functions, palette, borders } = theme;
  const { color } = ownerState;

  const { linearGradient } = functions;
  const { gradients } = palette;
  const { borderRadius } = borders;

  return {
    backgroundColor: rgba(gradients[color].main, 0.05),
    borderRadius: borderRadius.md,
    color: "rgb(52, 71, 103)",
    display: "grid",
    placeItems: "center",
    "& .MuiIcon-root": {

      background: gradients[color]
        ? linearGradient(gradients[color].main, gradients[color].state)
        : linearGradient(gradients.dark.main, gradients.dark.state),
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }
  };
}

export { menuItem, menuIcon };
