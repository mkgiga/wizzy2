export function getMaterialIcon(tagName = "div") {
  const res = materialIcons[tagName.toLowerCase()] || "extension";
  return res;
}
const materialIcons = {
  p: "text_fields",
  div: "view_module",
  span: "code",
  a: "link",
  img: "image",
  ul: "list",
  li: "list_item",
  button: "smart_button",
  input: "input",
  form: "assignment",
  table: "table_chart",
  tr: "table_rows",
  td: "table_cells",
  th: "table_header",
  header: "header",
  footer: "footer",
  nav: "navigation",
  section: "section",
  article: "article",
  aside: "aside",
  h1: "title",
  h2: "title",
  h3: "title",
  h4: "title",
  h5: "title",
  h6: "title",
  video: "videocam",
  audio: "audiotrack",
  canvas: "palette",
  svg: "graphic_eq",
  iframe: "web",
  blockquote: "format_quote",
  pre: "code",
  code: "code",
  figure: "image",
  figcaption: "caption",
  main: "main",
  mark: "highlight",
  progress: "hourglass_empty",
  meter: "speed",
  details: "details",
  summary: "summary",
  time: "schedule",
  dialog: "chat",
  template: "template",
  script: "script",
  style: "style",
  link: "link",
  meta: "info",
  title: "title",
  body: "view_quilt",
  head: "description",
  html: "html",
  br: "line_break",
  hr: "horizontal_rule",
  label: "label",
  select: "select",
  option: "option",
  textarea: "text_fields",
  fieldset: "fieldset",
  legend: "legend",
  datalist: "datalist",
  optgroup: "optgroup",
  output: "output",
  map: "map",
  area: "area",
  object: "object",
  param: "param",
  embed: "embed",
  source: "source",
  track: "track",
  wbr: "wbr",
  bdi: "bidi",
  bdo: "bidi",
  ruby: "ruby",
  rt: "ruby_text",
  rp: "ruby_parenthesis",
  data: "data",
  kbd: "keyboard",
  samp: "sample",
  var: "variable",
  abbr: "abbreviation",
  cite: "citation",
  q: "quote",
  small: "small",
  sub: "subscript",
  sup: "superscript",
  del: "strikethrough",
  ins: "insert",
  strong: "bold",
  em: "italic",
  b: "format_bold",
  i: "format_italic",
  u: "format_underlined",
  s: "format_strikethrough",
  tt: "text_format",
  big: "text_increase",
  small: "text_decrease",
  dfn: "definition",
  address: "location_on",
  cite: "citation",
  bdo: "bidi",
  bdi: "bidi",
  ruby: "ruby",
  rt: "ruby_text",
  rp: "ruby_parenthesis",
  data: "data",
  kbd: "keyboard",
  samp: "sample",
  var: "variable",
  abbr: "abbreviation",
  cite: "citation",
  q: "quote",
  small: "small",
  sub: "subscript",
  sup: "superscript",
  del: "strikethrough",
  ins: "insert",
  picture: "photo",
  source: "source",
  track: "track",
  noscript: "no_script",
  menu: "menu",
  menuitem: "menu_item",
  dialog: "dialog",
  summary: "summary",
  details: "details",
  slot: "slot",
  template: "template",
  caption: "caption",
  col: "table_column",
  colgroup: "table_columns",
  dd: "definition_description",
  dl: "definition_list",
  dt: "definition_term",
  frame: "frame",
  frameset: "frameset",
  noframes: "no_frame",
  object: "object",
  param: "parameter",
  picture: "photo",
  rp: "ruby_parenthesis",
  rt: "ruby_text",
  ruby: "ruby",
  slot: "slot",
  template: "template",
  track: "track",
  wbr: "word_break",
};

export default {
  getMaterialIconFor: getMaterialIcon,
};
