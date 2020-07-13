import 'rsuite/dist/styles/rsuite-default.css';

import './App.css';

import {
  Breadcrumb,
  ButtonGroup,
  ButtonToolbar,
  Container,
  Content,
  Footer,
  Form,
  Header,
  Icon,
  IconButton,
  Panel,
  Table,
  FlexboxGrid,
  Placeholder,
  Modal,
  Button,
  Input,
} from 'rsuite';
import * as React from 'react';

import type { FileInfo } from './api/type';
import { makeDummyApi, RootId } from './api/dummyApi';

const { Column, HeaderCell, Cell } = Table;

interface AppProps {}

type Action<T, P> = { readonly type: T; readonly payload: P };
type AC<T, P> = {
  (payload: P): Action<T, P>;
  toString(): T;
  type: T;
};
type VoidAC<T> = {
  (): Action<T, void>;
  toString(): T;
  type: T;
};
type ActionCreator<T, P> = P extends void ? VoidAC<T> : AC<T, P>;
export type ActionOf<T extends ActionCreator<any, any>> = ReturnType<T>;
export const createAction = <T, P = void>(type: T): ActionCreator<T, P> => {
  let f = (payload: P) => ({ type, payload });
  (f as any).toString = () => type;
  (f as any).type = type;
  return f as ActionCreator<T, P>;
};

const api = makeDummyApi();

type State = {
  back: FileInfo[];
  forward: FileInfo[];
  workingDir: FileInfo | void;
  children: FileInfo[];
};

let cd = createAction<'cd', FileInfo>('cd');
let ls = createAction<'ls', FileInfo[]>('ls');
let mkdir = createAction<'mkdir', FileInfo>('mkdir');
let goBack = createAction('back' as const);
let goForward = createAction('forward' as const);
type Actions =
  | ActionOf<typeof cd>
  | ActionOf<typeof ls>
  | ActionOf<typeof mkdir>
  | ActionOf<typeof goBack>
  | ActionOf<typeof goForward>;

const exhaustiveCheck = (_: never) => {};
let reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case cd.type:
      return {
        ...state,
        back: state.workingDir
          ? state.back.concat(state.workingDir)
          : state.back,
        forward: [],
        workingDir: action.payload,
      };
    case ls.type:
      return {
        ...state,
        children: action.payload,
      };
    case mkdir.type:
      return {
        ...state,
        children: state.children.concat(action.payload),
      };
    case goBack.type: {
      let { back, forward, workingDir } = state;
      if (!workingDir || !back.length) return state;
      let last = back[back.length - 1];
      let remain = back.slice(0, back.length - 1);
      return {
        ...state,
        back: remain,
        forward: forward.concat(workingDir),
        workingDir: last,
      };
    }
    case goForward.type: {
      let { back, forward, workingDir } = state;
      if (!workingDir || !forward.length) return state;
      let last = forward[forward.length - 1];
      let remain = forward.slice(0, forward.length - 1);
      return {
        ...state,
        forward: remain,
        back: back.concat(workingDir),
        workingDir: last,
      };
    }
    default:
      exhaustiveCheck(action);
      return state;
  }
};

function App({}: AppProps) {
  let [state, dispatch] = React.useReducer(reducer, {
    back: [],
    forward: [],
    workingDir: undefined,
    children: [],
  });

  let { workingDir, children, back, forward } = state;
  let [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!workingDir) return;
    setLoading(true);
    api.ls(workingDir.id).then((fs) => {
      dispatch(ls(fs));
      setLoading(false);
    });
  }, [workingDir]);

  React.useEffect(() => {
    api.show(RootId).then((root) => {
      dispatch(cd(root));
    });
  }, []);

  let [show, setShow] = React.useState(false);

  let inputRef = React.useRef<undefined | HTMLInputElement>();

  let createFolder = () => {
    let input = inputRef.current;
    if (!input || !workingDir || !input.value.trim()) return;
    setShow(false);
    setLoading(true);
    api.makeDir(workingDir.id, input.value.trim()).then((f) => {
      setLoading(false);
      dispatch(mkdir(f));
    });
  };

  let ts = React.useRef(0);
  let rowClick = (f: FileInfo) => {
    let then = ts.current;
    ts.current = Date.now();
    let delta = ts.current - then;

    if (delta < 300) {
      // double click
      dispatch(cd(f));
    }
  };

  return (
    <Container className="main">
      <Header>
        <Panel>
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <ButtonToolbar>
                <ButtonGroup>
                  <IconButton
                    disabled={back.length == 0}
                    size="sm"
                    icon={<Icon icon="arrow-left" />}
                    onClick={() => dispatch(goBack())}
                  />
                  <IconButton
                    disabled={forward.length == 0}
                    size="sm"
                    icon={<Icon icon="arrow-right" />}
                    onClick={() => dispatch(goForward())}
                  />
                </ButtonGroup>
              </ButtonToolbar>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <IconButton
                size="sm"
                icon={<Icon icon="folder" />}
                onClick={() => setShow(true)}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Panel>
      </Header>

      <Content>
        <Panel>
          <Table loading={loading} data={children} onRowClick={rowClick}>
            <Column flexGrow={1}>
              <HeaderCell>Name</HeaderCell>
              <Cell dataKey="name" />
            </Column>
            <Column>
              <HeaderCell>Size</HeaderCell>
              <Cell dataKey="size" />
            </Column>
          </Table>
        </Panel>
      </Content>

      <Footer className="status">
        <Breadcrumb>
          {workingDir ? (
            [
              workingDir.path.map((f) => (
                <Breadcrumb.Item
                  key={`key-${f.id}`}
                  onClick={() => dispatch(cd(f))}
                >
                  {f.name}
                </Breadcrumb.Item>
              )),
              <Breadcrumb.Item key={`key-${workingDir.id}`} active>
                {workingDir.name}
              </Breadcrumb.Item>,
            ]
          ) : (
            <Placeholder.Paragraph active rows={1} />
          )}
        </Breadcrumb>
        <small>
          {children.filter((f) => f.kind == 'dir').length} folders,{' '}
          {children.filter((f) => f.kind == 'file').length} files
        </small>
      </Footer>

      <Modal show={show}>
        <Form onSubmit={createFolder}>
          <Modal.Title>Create new folder</Modal.Title>
          <Modal.Body>
            <label>
              Folder name
              <Input inputRef={inputRef} autoFocus />
            </label>
          </Modal.Body>
          <Modal.Footer>
            <Button appearance="primary" onClick={createFolder}>
              OK
            </Button>
            <Button appearance="default" onClick={() => setShow(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default App;
