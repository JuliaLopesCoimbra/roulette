"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // ⬅️ IMPORTANTE
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";

// Extensões e configurações
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore); // ⬅️ ATIVANDO O PLUGIN
dayjs.locale("pt-br");
registerLocale("pt-BR", ptBR);

// Função que gera os dados por dia da semana até hoje
function gerarDadosDeCliques(semanaISO) {
  const inicio = dayjs(semanaISO).startOf("week").add(1, "day"); // Segunda-feira
  const hoje = dayjs();

  return Array.from({ length: 7 }).map((_, i) => {
    const dia = inicio.add(i, "day");
    const nomeDia = dia.format("dddd").replace("-feira", "");
    const capitalizado = nomeDia.charAt(0).toUpperCase() + nomeDia.slice(1);

    const cliques = dia.isSameOrBefore(hoje, 'day') ? Math.floor(Math.random() * 100) + 10 : null;

    return {
      dia: capitalizado,
      cliques,
    };
  });
}

// Transforma data para string da semana ISO
function getWeekString(date) {
  const d = dayjs(date);
  return `${d.year()}-W${String(d.isoWeek()).padStart(2, "0")}`;
}

export default function ClicksChart() {
  const [semanaAtual, setSemanaAtual] = useState(() => {
    const hoje = dayjs();
    return `${hoje.year()}-W${String(hoje.isoWeek()).padStart(2, "0")}`;
  });

  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const partes = semanaAtual.split("-W");
    const ano = parseInt(partes[0]);
    const semana = parseInt(partes[1]);
    const inicioSemana = dayjs().year(ano).isoWeek(semana).startOf("week").add(1, "day");
    const dadosGerados = gerarDadosDeCliques(inicioSemana);
    setDados(dadosGerados);
  }, [semanaAtual]);

  const handleWeekChange = (date) => {
    setDataSelecionada(date);
    setSemanaAtual(getWeekString(date));
  };

  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Cliques por dia</h3>
        <DatePicker
          selected={dataSelecionada}
          onChange={handleWeekChange}
          dateFormat="dd/MM/yyyy"
          locale="pt-BR"
          calendarStartDay={1}
          showPopperArrow={false}
          className="bg-[#1f1f1f] border border-gray-600 text-white rounded px-3 py-1"
        />
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={dados}>
          <Line type="monotone" dataKey="cliques" stroke="#1e3a8a" connectNulls />
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
