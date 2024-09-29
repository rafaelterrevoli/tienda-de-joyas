import { pool } from "../db.js";
import format from "pg-format";

const estructuraHateoas = (data) => {
  const stockTotal = data.reduce((stock, joya) => {
    return (stock += joya.stock);
  }, 0);
  const totalJoyas = data.length;
  const results = data.map((joya) => ({
    nombre: joya.nombre,
    link: `/api/joya/${joya.id}`,
  }));
  return { totalJoyas, stockTotal, results };
};

const consultaJoyas = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
  try {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;
    const formattedQuery = format("SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",campo, direccion, limits, offset);
    pool.query(formattedQuery);
    const { rows: joyas } = await pool.query(formattedQuery);
    return joyas;
  } catch (error) {
    console.error("Error al obtener joyas:", error);
    throw error;
  }
};

const obtenerJoyas = async (req, res) => {
  try {
    const { limits, order_by, page } = req.query;
    const joyas = await consultaJoyas({ limits, order_by, page });
    const joyasHateoas = estructuraHateoas(joyas);
    res.status(200).json(joyasHateoas);
  } catch (error) {
    console.log(error);
    res.status(500).json("Ocurrio un error al obtener joyas");
  }
};

const consultaJoyasPorFiltros = async ({precio_min, precio_max, categoria, metal}) => {
  try {
    let filtros = [];
    if (precio_min) filtros.push(`precio >= ${precio_min}`);
    if (precio_max) filtros.push(`precio <= ${precio_max}`);
    if (categoria) filtros.push(`categoria = '${categoria}'`);
    if (metal) filtros.push(`metal = '${metal}'`);
    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
      filtros = filtros.join(" AND ");
      consulta += ` WHERE ${filtros}`;
    }
    const { rows: joyas } = await pool.query(consulta);
    return joyas;
  } catch (error) {
    console.error("Error al obtener joyas usando filtros:", error);
    throw error;
  }
};

const obtenerJoyasPorFiltros = async (req, res) => {
  try {
    const query = req.query;
    const joyas = await consultaJoyasPorFiltros(query);
    res.status(200).json(joyas);
  } catch (error) {
    console.log(error);
    res.status(500).json("Ocurrio un error al obtener joyas por filtros");
  }
};

export const controller = {
 obtenerJoyas,
 obtenerJoyasPorFiltros
};