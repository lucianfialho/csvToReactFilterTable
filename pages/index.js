import React, { useCallback, useState, useEffect } from "react";
import { fetchAPI } from "../lib/api";
import Head from 'next/head'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';



export default function Home() {

  const handleLogin = () => {
    console.log("asd")

  }

  return (
    <div className="container">
      <Head>
        <title>Faça orçamento de obras com no SINAP mais rápido - Orça Obra Fácil</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1> Orça obra fácil :)</h1>
      </header>

      <main>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <form onSubmit={handleLogin}>
          <TextField style={{ margin: '10px 0' }} fullWidth id="email" label="Email" variant="outlined" />
          <TextField  style={{ margin: '10px 0' }} fullWidth id="outlined-password-input" label="Password" type="password" autoComplete="current-password"/>
          <Button variant="outlined" style={{ margin: '10px 0', float:'left' }}>
          Cadastre-se
          </Button>
          <LoadingButton variant="contained"  style={{ margin: '10px 5px 0 0', float:'right' }} type="submit" loading={false} variant="outlined">
            Login
          </LoadingButton>
        </form>
      </Box>
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

export async function getStaticProps() {
  const insumosSinapi = await fetchAPI("/sinapi-insumos")
  return {
    props: { insumosSinapi }
  }
}