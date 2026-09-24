/** Hairline margins that run the full height of the page, like the border of a drawing sheet. */
const Frame = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden justify-center md:flex">
    <div className="h-full w-full max-w-[62rem] border-x border-rule/60" />
  </div>
);

export default Frame;
