import React, { useCallback, useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Fab, TextField, Input, Button } from "@material-ui/core";
import LoadingButton from '@mui/lab/LoadingButton';

import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import Head from 'next/head'
import { FastfoodOutlined } from "@material-ui/icons";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Home() {
  const [dataJson, setDataJson] = useState(false);
  const [filteredJsonData, setFilteredJsonData] = useState([])
  const [selectedItems, updateSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(false)
  const parseCSV = (text) => {
    const result = {
      header: [],
      data: []
    };
  
    const [header, ...content] = text.split('\n');
  
    result.header = header.split(';');
    // Camelize
    result.header = convertHeaderToCammelCase(result.header)
    result.header.push('quantity')
    const maxCols = result.header.length;
  
    content.forEach((item) => {
      result.data.push(item.split(';').slice(0, maxCols));
    });
  
    return result;
  };
  
  const convertHeaderToCammelCase =  (headerArray) => {
    return headerArray.map((item) => camelize(item.toLowerCase()))
  }

  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  useEffect(() => {
    if (!dataJson.data) return
    const newDataJsonData = recreateDataArray(dataJson.data)

    setFilteredJsonData(newDataJsonData)
  }, [dataJson]);

  const recreateDataArray = (data) => {
    return data.map((item) => {
      return item.reduce((acumulador, valorAtual, index) => {
        acumulador = {
          ...acumulador,
        }

        acumulador[dataJson.header[index]] = valorAtual;

        acumulador['quantity'] = 1
        return acumulador
      }, {})
    })

  }
  
  const handleChangeCsv = useCallback((e) => {
    if(e.target.files.length > 0){
      const reader = new FileReader()
      reader.onload = async (e) => { 
        const dataToJson = parseCSV(e.target.result)
        setDataJson(dataToJson)
      };
      reader.readAsText(e.target.files[0])
    }
  }, []);

  const selectItemList = useCallback((data) => {
    updateSelectedItems(prevState => data)
  }, []);

  const handleQuantity = (e, data, index) => {
    
    let items = [...selectedItems]
    let item = {...items[index]}
    item.quantity = parseInt(e.target.value) + 1
    items[index] = item
    updateSelectedItems(items)
  }

  const generateList = (e) => {
    e.preventDefault()
    setLoading(true)

    const subTotal = selectedItems.reduce((sum, { quantity, precoMedianoR$ }) => {
      console.log(quantity)
      return sum + parseFloat(precoMedianoR$.replace(',', '.')) * quantity
    }, 0)

    setTotal(subTotal)

    setTimeout(() => {
      window.print()
    }, 2000);
  }


  const clear = (e) => {
    e.preventDefault()
    setLoading(false)
    setDataJson(false)
    setTotal(0)
    updateSelectedItems([])
  }

  return (
    <div className="container">
      <Head>
        <title>Faça orçamento de obras com no SINAP mais rápido - Orça Obra Fácil</title>
        <link rel="icon" href="/favicon.ico" />
        <script data-ad-client="ca-pub-3181441175405362" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      </Head>

      <main>
      {!dataJson && (
        <label htmlFor="upload-csv">
          <Input
            style={{ display: "none" }}
            id="upload-csv"
            name="upload-csv"
            type="file"
            onChange={handleChangeCsv}
          />
          <Fab
            color="secondary"
            size="small"
            component="span"
            aria-label="add"
            variant="extended"
          >
            <AddIcon /> Upload Csv
          </Fab>
        </label>
      )}
       
      {dataJson && !loading && (
        <Autocomplete
          multiple
          disablePortal
          id="combo-box-demo"
          options={filteredJsonData}
          sx={{ width: 600 }}
          getOptionLabel={(option) => {
            return `${option.codigo} - ${option.descricaoDoInsumo}`
          }}
          renderInput={(params) => <TextField {...params} label="Pesquisa Fabola :D" />}
          onChange={(event, newInputValue) => selectItemList(newInputValue)}
        />
      )}
      <br/>
      {dataJson && (
        <div className={`content`}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                {dataJson.header.map((row) => (
                    <StyledTableCell key={row}>{row}</StyledTableCell>
                ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems?.map((row, index) => (
                  <StyledTableRow key={row.codigo}>
                    <StyledTableCell component="th" scope="row">
                      {row.codigo}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.descricaoDoInsumo}</StyledTableCell>
                    <StyledTableCell align="right">{row.unidadeDeMedida}</StyledTableCell>
                    <StyledTableCell align="right">{row.origemDoPreco}</StyledTableCell>
                    <StyledTableCell align="right">{row.precoMedianoR$}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Input
                        id="standard-number"
                        type="number"
                        variant="standard"
                        defaultValue={row.quantity}
                        onChange={(e) => {handleQuantity(e, row, index) }}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell align="right">{total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {selectedItems.length && (
            <>
              <LoadingButton loading={loading} className={`gerarRelatorio`} variant="contained" onClick={generateList}>{`Gerar relatório`}</LoadingButton>
              <Button className={`gerarRelatorio`} variant="contained" onClick={clear}>{`Voltar ao inicio`}</Button>
            </>
          )}
        </div>
      )}
      {!dataJson && (
        <h2>Ainda não foi selecionado nenhum item ...</h2>
      )}
      </main>


      <footer>
        Powered by{' Alma negra '}
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }

      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .content .gerarRelatorio{
          float: right;
          margin: 20px 10px;
        }
        @media print {
          .gerarRelatorio {
            display: none;
          }
          .footer {
            display: none
          }
        }
      `}</style>
    </div>
  )
}
