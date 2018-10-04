module.exports = [
  {
    type: "folder",
    title: "A",
    add_date: Date.now(),
    last_modified: Date.now(),
    ns_root: "toolbar",
    children: [
      {
        type: "folder",
        title: "B",
        add_date: Date.now(),
        last_modified: Date.now(),
        children: [
          { type: "bookmark", title: "C*", url: "curl", add_date: Date.now() }
        ]
      },
      {
        type: "bookmark",
        title: "D*",
        url: "d Url",
        add_date: Date.now()
      }
    ]
  },
  {
    type: "bookmark",
    url: "https://cycle.js.org",
    title: "E*",
    add_date: Date.now()
  }
];
