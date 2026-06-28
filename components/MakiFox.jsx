export default function MakiFox({ className = "" }) {
  return (
    <div className={`w-[100px] h-[100px] animate-flotar relative ${className}`}>
      {/* We use an SVG or the image provided in the HTML for MakiFox */}
      {/* The HTML references an image: */}
      <img
        alt="MAKI Fox"
        className="w-full h-full object-cover rounded-full border-4 border-surface-container-lowest shadow-lg"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4HlkzVm2emvXfyvfuUKT5u-YytM05YRmHzyfIrApQt1ST8J9pLO_v9xE476Hl43DPjaApwEuxt5W6vodPdy4hU1tUO7ZpU5UuXoC0dzZ42GJoLSOkKY2pg9AUjdlO_lXY_gYGrSojpru5MnZZU9yqn21W94OampYXfH351vNjBI-cExnPOQ5NQcQiu7FfEL2SCSQOaXYW0Q1o8q8VEzmZ0dk8Kp6DPxMt_Z2SQxLDABnbnk7KK2oAKc2VdvZ8UT6fsJSYwOotR1A"
      />
    </div>
  );
}
