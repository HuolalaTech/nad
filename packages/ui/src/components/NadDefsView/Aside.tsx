import { Checkbox, Tree } from 'antd';
import { Key, useMemo, useState } from 'react';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { useNadDefsViewContext } from './Context';
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
  const { defs, base } = context;

  const { treeData, defaultCheckedKeys, defaultExpandedKeys } =
    useMemo(() => {
      const builder = new Builder({ target: 'raw', defs, base });
      const treeData = builder.root.modules.map((i) => {
        return {
          key: i.name as Key,
          title: i.description || i.moduleName,
          children: i.routes.map((a) => ({
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
          />{' '}
          <span
            className='all'
            role='button'
            onClick={() => {
              context.selectApi('*');
            }}
          >
            All
          </span>
        </div>
      </div>
      <Tree
        onCheck={(data) => {
          const list = data instanceof Array ? data : data.checked;
          const apis = list.map((i) => String(i).replace('::', '.'));
          context.setApis(apis);
          setCks(list);
        }}
        onSelect={([api]) => {
          if (typeof api !== 'string') return;
          context.selectApi(api);
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
        selectedKeys={[]}
        selectable={true}
      />
    </aside>
  );
};
