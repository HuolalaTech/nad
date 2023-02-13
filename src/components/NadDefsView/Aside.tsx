import { Checkbox, Tree } from 'antd';
import { Key, useMemo, useState } from 'react';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { useNadDefsViewContext } from './Context';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { Builder, Route } from '@huolala-tech/nad-builder';

const TreeMethod = ({ api }: { api: Route }) => {
  const { uniqName, description } = api;
  if (description) {
    return (
      <div>
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {uniqName}
        </div>
        <div style={{ opacity: 0.5 }}>{description}</div>
      </div>
    );
  } else {
    return <div style={{ whiteSpace: 'nowrap' }}>{uniqName}</div>;
  }
};

export const Aside = () => {
  const context = useNadDefsViewContext();
  const [usp] = useSearchParams();
  const { defs, base } = context;
  const navigate = useNavigate();
  const { treeData, defaultCheckedKeys, defaultExpandedKeys } =
    useMemo(() => {
      const builder = new Builder({ target: 'raw', defs, base });
      const treeData = builder.root.routes.map((i) => {
        return {
          key: i.name as Key,
          title: i.description || i.moduleName,
          children: i.apis.map((a) => ({
            key: (i.name + '::' + a.uniqName) as Key,
            title: <TreeMethod api={a} />
          }))
        };
      });
      const defaultCheckedKeys = treeData
        .map((i) => [i.key, i.children.map((i) => i.key)].flat())
        .flat();
      const defaultExpandedKeys = treeData.map((i) => i.key);
      return { treeData, defaultCheckedKeys, defaultExpandedKeys };
    }, [defs, base]) || {};

  const [cks, setCks] = useState(defaultCheckedKeys);
  const [eks, setEks] = useState(defaultExpandedKeys);
  const sks = usp.getAll('select');

  return (
    <aside>
      <div className='tools'>
        <div>
          <span
            className='square'
            onClick={() => {
              if (eks.length) setEks([]);
              else setEks(defaultExpandedKeys);
            }}
          >
            {eks.length ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
          </span>
        </div>
        <div>
          <Checkbox
            checked={cks.length === defaultCheckedKeys.length}
            indeterminate={
              cks.length > 0 && cks.length < defaultCheckedKeys.length
            }
            onChange={(e) => {
              const list = e.target.checked ? defaultCheckedKeys : [];
              const apis = list.map((i) => String(i).replace('::', '.'));
              context.setApis(apis);
              setCks(list);
            }}
          >
            All
          </Checkbox>{' '}
        </div>
      </div>
      <Tree
        onCheck={(data) => {
          const list = data instanceof Array ? data : data.checked;
          const apis = list.map((i) => String(i).replace('::', '.'));
          context.setApis(apis);
          setCks(list);
        }}
        onSelect={([item]) => {
          const u = new URLSearchParams(usp);
          if (typeof item === 'string') {
            u.set('select', item);
          } else {
            u.delete('select');
          }
          navigate({ search: u.toString() });
        }}
        onExpand={(v) => {
          setEks(v);
        }}
        checkable
        treeData={treeData}
        defaultCheckedKeys={defaultCheckedKeys}
        defaultExpandedKeys={defaultExpandedKeys}
        checkedKeys={cks}
        expandedKeys={eks}
        selectedKeys={sks}
        selectable={true}
      />
    </aside>
  );
};
