
<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    include_once '../../config/db.php';
    include_once '../../classes/relatorioagendamentos.php';    

    require_once '../../libs/dompdf/autoload.inc.php';    
    use Dompdf\Dompdf;
    
    $resultado = new stdClass();
    
    $database = new Database();
    $db = $database->getConnection();
    
    $classe = new RelatorioAgendamentos($db);
    
    $condicao = "";

    if(isset($_GET['id_usuario'])){
        $condicao .= $condicao == "" ? " WHERE " : " AND ";
        $condicao .= "ag.id_usuario = ". htmlspecialchars(strip_tags($_GET['id_usuario']));
    }

    if(isset($_GET['id_servico'])){
        $condicao .= $condicao == "" ? " WHERE " : " AND ";
        $condicao .= "ag.id_servico = ". htmlspecialchars(strip_tags($_GET['id_servico']));
    }

    if(isset($_GET['situacao'])){
        if($_GET['situacao'] != ''){
            $condicao .= $condicao == "" ? " WHERE " : " AND ";
            $condicao .= "ag.situacao = ". htmlspecialchars(strip_tags($_GET['situacao']));
        }
    }
    
    if(isset($_GET['datainicio']) && isset($_GET['datafim'])){
        $condicao .= $condicao == "" ? " WHERE " : " AND ";
        $condicao .= "ag.data BETWEEN CAST('". htmlspecialchars(strip_tags($_GET['datainicio'])) . "' AS DATE ) AND CAST('". htmlspecialchars(strip_tags($_GET['datafim'])) ."' AS DATE)";
    }

    $classe->condicao = $condicao;

    $res = $classe->buscaAgendamentos();

    if($res->retorno != "OK"){
        $resultado->retorno = "ERRO";
        $resultado->msg = $res->msg;
        echo json_encode($resultado);
    }
    else{
        try{
            $html = "
            <h2 style='width:100%; text-align:center;'> Relatório de Agendamentos</h2>
            <table style='width:100%'>
            <tr style='background-color:grey'>
                <th style='width:10%'>Id Agendamento</th>
                <th style='width:20%'>Cliente</th>
                <th style='width:15%'>Serviço</th>
                <th style='width:15%'>Data</th>
                <th style='width:15%'>Valor</th>
                <th style='width:15%'>Situacao</th>
            </tr>";

            $totalAgendamentos = 0;
            $totalAgendamentosCancelados = 0;
            $totalAgendamentosFinalizados = 0;
            $totalAgendamentosAbertos = 0;
            while ($dados = $res->sth->fetch(PDO::FETCH_OBJ)){
                $totalAgendamentos += $dados->valor;

                if($dados->situacao == 1){
                    $dados->situacao_desc = "Confirmado";
                    $totalAgendamentosAbertos += $dados->valor;
                }
                else if($dados->situacao == 2){
                    $dados->situacao_desc = "Finalizado";
                    $totalAgendamentosFinalizados += $dados->valor;
                }
                else if($dados->situacao == 3){
                    $dados->situacao_desc = "Cancelado";
                    $totalAgendamentosCancelados += $dados->valor;
                }
                else {
                    $dados->situacao_desc = "Arguardando";
                    $totalAgendamentosAbertos += $dados->valor;
                }

                $dados->data = date('d/m/Y', strtotime($dados->data));
                $dados->valor = 'R$ '.number_format($dados->valor, 2, ',', '.');

                $html .= "
                <tr>
                    <th style='width:10%'>{$dados->id}</th>
                    <th style='width:20%'>{$dados->nome}</th>
                    <th style='width:15%'>{$dados->descricao}</th>
                    <th style='width:15%'>{$dados->data}</th>
                    <th style='width:15%'>{$dados->valor}</th>
                    <th style='width:15%'>{$dados->situacao_desc}</th>
                </tr>
                ";
            }

            $totalAgendamentos = 'R$ '.number_format($totalAgendamentos, 2, ',', '.');
            $totalAgendamentosFinalizados = 'R$ '.number_format($totalAgendamentosFinalizados, 2, ',', '.');
            $totalAgendamentosCancelados = 'R$ '.number_format($totalAgendamentosCancelados, 2, ',', '.');
            $totalAgendamentosAbertos = 'R$ '.number_format($totalAgendamentosAbertos, 2, ',', '.');
            $html .= "
                <tr style='background-color:#D3D3D3'>
                    <th style='width:10%'></th>
                    <th style='width:20%'></th>
                    <th style='width:15%'></th>
                    <th style='width:15%'>Total Abertos</th>
                    <th style='width:15%'>{$totalAgendamentosAbertos}</th>
                    <th style='width:15%'></th>
                </tr>
                <tr style='background-color:#D3D3D3'>
                    <th style='width:10%'></th>
                    <th style='width:20%'></th>
                    <th style='width:15%'></th>
                    <th style='width:15%'>Total Finalizados</th>
                    <th style='width:15%'>{$totalAgendamentosFinalizados}</th>
                    <th style='width:15%'></th>
                </tr>
                <tr style='background-color:#D3D3D3'>
                    <th style='width:10%'></th>
                    <th style='width:20%'></th>
                    <th style='width:15%'></th>
                    <th style='width:15%'>Total Cancelados</th>
                    <th style='width:15%'>{$totalAgendamentosCancelados}</th>
                    <th style='width:15%'></th>
                </tr>
                <tr style='background-color:#D3D3D3'>
                    <th style='width:10%'></th>
                    <th style='width:20%'></th>
                    <th style='width:15%'></th>
                    <th style='width:15%'>Total Agendamentos</th>
                    <th style='width:15%'>{$totalAgendamentos}</th>
                    <th style='width:15%'></th>
                </tr>
            </table>
            ";

            $dompdf = new Dompdf();

            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $file = $dompdf->output();

            if(!is_dir("../../arquivos"))
                mkdir("../../arquivos", 0777);

            file_put_contents('../../arquivos/relatorio_agendamentos.pdf', $file);

            $resultado->caminho = "http://localhost/dsin/php/arquivos/relatorio_agendamentos.pdf";

        }
        catch(Exception $e){
            $resultado->retorno = "ERRO";
            $resultado->msg = $e->getMessage();
            echo json_encode($resultado);
        }

        $resultado->retorno = "OK";
        echo json_encode($resultado);
    }
?>