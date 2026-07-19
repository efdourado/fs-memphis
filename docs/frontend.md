# Frontend

React, Vite and plain CSS.

The interface was designed and built by hand. It is a system, not a collection of isolated screens.

## Flow

```text
Page
  → component
  → hook / context
  → service
  → API
```

## Structure

- `pages/` composes complete experiences.
- `components/ui/` holds reusable visual language.
- `components/layout/` connects navigation, theme and playback.
- `context/` owns shared state such as auth, player and song menus.
- `hooks/` keeps component behavior focused.
- `services/` contains API communication.
- `styles/` mirrors components and pages.

## Design system

Shared tokens in `styles/base.css` control color, type, spacing, radius, shadow and motion.

Themes change tokens. Components keep their identity.

`Card`, `Item`, `List`, `Bias`, `Carousel`, `Hero`, `Modal` and `Form` are shared primitives. Collection and playback components build on the same states and actions.

## Listening experience

- Today records a moment.
- Journal keeps the private timeline.
- Session Detail explains one entry.
- Patterns shows evidence with every insight.
- References keeps optional links outside Memphis.
- Design Archive preserves the original interface.

## Design archive

The original music UI will remain available as a representation of the first Memphis version.

It does not need a real catalog to remain useful. Its value is the design, interaction and composition.
