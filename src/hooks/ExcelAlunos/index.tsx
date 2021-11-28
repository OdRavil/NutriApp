import * as Excel from "exceljs";
import moment from "moment";
import { useAuth } from "../../context/auth";
import { TipoAnamnese } from "../../models/Anamnese";
import { TipoUsuario } from "../../models/Usuario";
import AlunoService from "../../services/AlunoService";
import AnamneseService from "../../services/AnamneseService";
import EscolaService from "../../services/EscolaService";
import TurmaService from "../../services/TurmaService";

const alunoService = new AlunoService();
const escolaService = new EscolaService();
const turmaService = new TurmaService();
const anamneseService = new AnamneseService();

export interface AlunoExcel {
	id: string;
	nome: string;
	email?: string;
	sexo?: string;
	dataNascimento?: string;

	idTurma: string;
	turma: string;
	idEscola: string;
	escola: string;

	peso?: number;
	altura?: number;
	imc?: number;

	questaoPossuiHabitoSaudavel?: string;
	questaoPossuiDoenca?: string;
}

const useExcelAlunos = () => {
	const { auth } = useAuth();

	const getDadosExportacao = async (): Promise<AlunoExcel[]> => {
		if (!auth?.user?.id) return [];

		const escolas = await escolaService
			.listar()
			.then((lista) =>
				auth.user.tipo === TipoUsuario.ADMINISTRADOR
					? lista
					: lista.filter((escola) => auth.user.listaEscola.includes(escola.id!))
			);

		const escolasIds = escolas.map((escola) => escola.id);

		const turmas = await turmaService
			.listar()
			.then((lista) =>
				auth.user.tipo === TipoUsuario.ADMINISTRADOR
					? lista
					: lista.filter((turma) => escolasIds.includes(turma.idEscola))
			);

		const turmasIds = turmas.map((turma) => turma.id);

		const alunos = await alunoService
			.listar()
			.then((lista) =>
				lista.filter((aluno) => aluno.status && turmasIds.includes(aluno.idTurma))
			);

		const alunosIds = alunos.map((aluno) => aluno.id);

		const anamneses = await anamneseService
			.listar()
			.then((lista) =>
				lista.filter((anamnese) => alunosIds.includes(anamnese.idAluno))
			);

		return alunos.map((aluno) => {
			const turma = turmas.find((item) => item.id === aluno.idTurma)!;
			const escola = escolas.find((item) => item.id === turma.idEscola)!;
			const aDiabete = anamneses.find(
				(item) =>
					item.idAluno === aluno.id! && item.tipo === TipoAnamnese.DIABETES_METLITUS
			);
			const aObsesidade = anamneses.find(
				(item) => item.idAluno === aluno.id! && item.tipo === TipoAnamnese.OBESIDADE
			);
			const aHipertensao = anamneses.find(
				(item) =>
					item.idAluno === aluno.id! && item.tipo === TipoAnamnese.HIPERTENSAO
			);

			return {
				id: aluno.id!,
				nome: aluno.nome,
				email: aluno.email,
				sexo: aluno.sexo,
				dataNascimento: aluno.dataNascimento
					? moment(aluno.dataNascimento.toDate()).format("L")
					: undefined,

				idTurma: turma.id!,
				turma: turma.codigo,
				idEscola: escola.id!,
				escola: escola.nome,

				peso: aluno.dadosSaude?.peso,
				altura: aluno.dadosSaude?.altura,
				imc: aluno.dadosSaude?.imc,

				questaoPossuiHabitoSaudavel: aluno.dadosSaude?.questaoPossuiHabitoSaudavel,
				questaoPossuiDoenca: aluno.dadosSaude?.questaoPossuiDoenca,

				questaoPossuiPessoaComDiabetesNaFamilia:
					aDiabete?.questaoPossuiPessoaComDiabetesNaFamilia,
				questaoQuantasVezesPorSemanaComeDoce:
					aDiabete?.questaoQuantasVezesPorSemanaComeDoce,

				questaoPossuiPessoaComProblemaDeCoracao:
					aHipertensao?.questaoPossuiPessoaComProblemaDeCoracao,
				questaoPossuiHabitoDeAlimentosComMuitoSal:
					aHipertensao?.questaoPossuiHabitoDeAlimentosComMuitoSal,

				questaoPossuiHabitoDeBoaAlimentacao:
					aObsesidade?.questaoPossuiHabitoDeBoaAlimentacao,
				questaoEscalaSaudavel: aObsesidade?.questaoEscalaSaudavel,
				questaoOQueComeNoRecreio: aObsesidade?.questaoOQueComeNoRecreio,
				questaoQuantasVezesComeAlimentosFritos:
					aObsesidade?.questaoQuantasVezesComeAlimentosFritos,
			};
		});
	};

	const exportarDadosAlunos = async () => {
		if (!auth?.user?.id) return undefined;

		const dados = await getDadosExportacao();
		if (dados.length === 0) return undefined;

		const agora = moment().toDate();

		const workbook = new Excel.Workbook();
		workbook.creator = auth.user.nome;
		workbook.created = agora;
		const sheetAlunos = workbook.addWorksheet("ALUNOS");
		Object.keys(dados[0]).map((item) => ({
			header: item,
			key: item,
		}));
		sheetAlunos.columns = Object.keys(dados[0]).map((item) => ({
			header: item,
			key: item,
		}));

		dados.forEach((dado) => sheetAlunos.addRow({ ...dado }));
		return workbook;
	};

	return [exportarDadosAlunos];
};

export default useExcelAlunos;
