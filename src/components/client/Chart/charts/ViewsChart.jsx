"use client";
import { useEffect, useState } from "react";
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
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);
dayjs.locale("pt-br");
registerLocale("pt-BR", ptBR);


function gerarDadosSemana(semanaISO) {
  const start = dayjs(semanaISO).startOf("week").add(1, "day"); // Segunda-feira
  const hoje = dayjs();
  const semanaAtual = hoje.isoWeek();
  const semanaPassada = hoje.subtract(1, "week").isoWeek();
  const semanaReferencia = dayjs(semanaISO).isoWeek();

  return Array.from({ length: 7 }).map((_, i) => {
    const dia = start.add(i, "day");
    const nomeDia = dia.format("dddd").replace("-feira", "");
    const capitalizado = nomeDia.charAt(0).toUpperCase() + nomeDia.slice(1);

    let views = null;

    if (semanaReferencia === semanaAtual) {
      // Preencher apenas até o dia atual
      if (dia.isSameOrBefore(hoje, 'day')) {
        views = Math.floor(Math.random() * 200) + 50;
      }
    } else if (semanaReferencia === semanaPassada) {
      // Preencher tudo
      views = Math.floor(Math.random() * 200) + 50;
    }

    return { dia: capitalizado, views };
  });
}


function getWeekString(date) {
  const d = dayjs(date);
  return `${d.year()}-W${String(d.isoWeek()).padStart(2, "0")}`;
}

export default function ViewsChart() {
  const [semanaAtual, setSemanaAtual] = useState(() => {
    const hoje = dayjs();
    return `${hoje.year()}-W${String(hoje.isoWeek()).padStart(2, "0")}`;
  });

  const [dataSelecionada, setDataSelecionada] = useState(() => new Date());
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const partes = semanaAtual.split("-W");
    const ano = parseInt(partes[0]);
    const semana = parseInt(partes[1]);
    const inicioSemana = dayjs().year(ano).isoWeek(semana).startOf("week").add(1, "day");
    const dadosGerados = gerarDadosSemana(inicioSemana);
    setDados(dadosGerados);
  }, [semanaAtual]);

  const handleWeekChange = (date) => {
    setDataSelecionada(date);
    setSemanaAtual(getWeekString(date));
  };

  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Visualizações por dia</h3>
        <DatePicker
          selected={dataSelecionada}
          onChange={handleWeekChange}
          dateFormat="dd/MM/yyyy"
          locale="pt-BR"
          showPopperArrow={false}
          placeholderText="Selecione a semana"
          calendarStartDay={1} // começa na segunda
          className="bg-[#1f1f1f] border border-gray-600 text-white rounded px-3 py-1"
        />
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={dados}>
          <Line type="monotone" dataKey="views" stroke="#facc15" connectNulls={false} />
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
