import 'rsuite/dist/styles/rsuite-dark.css';

import './App.css';

import { Breadcrumb, Container, Content, Footer, Header, Table } from 'rsuite';
import * as React from 'react';

const { Column, HeaderCell, Cell } = Table;

interface AppProps {}

const files = [
  { name: 'abc', size: '--' },
  { name: 'xyz', size: '--' },
];

function App({}: AppProps) {
  return (
    <Container className="main">
      <Header>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Components</Breadcrumb.Item>
          <Breadcrumb.Item active>Breadcrumb</Breadcrumb.Item>
        </Breadcrumb>
      </Header>

      <Content>
        <Table data={files}>
          <Column flexGrow={1}>
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column>
            <HeaderCell>Size</HeaderCell>
            <Cell dataKey="size" />
          </Column>
        </Table>
      </Content>

      <Footer className="status"><small>2 folders</small></Footer>
    </Container>
  );
}

export default App;
