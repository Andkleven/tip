import faunadb, { Client } from "faunadb";
const client = new Client({
  secret: "fnAEL6eWovACBeiHZyTK1vEO0osAI5-OMWm1ej51",
});
const q = faunadb.query;

// res.status(200).json({ name: "John Doe" });
// if (req.method === "POST") {
// }
// const data = JSON.parse(req.body);

export default function handler(req, res) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    client
      .query(
        q.Create(q.Collection("tip"), {
          data,
        })
      )
      .then((ret) => {
        res.status(200).json({ ...ret.data, id: ret.ref.id });
      })
      .catch((err) => res.status(400).json(err));
  } else if (req.method === "GET") {
    client
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("tip"))),
          q.Lambda((x) => q.Get(x))
        )
      )
      .then((ret) => {
        const newData = ret.data.map((d) => {
          return { ...d.data, id: d.ref.id };
        });
        console.log(newData);
        res.status(200).json(newData);
      })
      .catch((err) => res.status(400).json(err));
  }
}
