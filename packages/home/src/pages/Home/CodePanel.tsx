import { MouseFocus } from '../../components/MouseFocus';
import { dedent } from '../../utils/dedent';
import { CodeSnip } from './snips/CodeSnip';

const codes = [
  {
    name: 'pom.xml',
    code: dedent`
      <dependency>
        <groupId>cn.lalaframework</groupId>
        <artifactId>nad-sdk</artifactId>
        <version>1.0.1-RELEASE</version>
      </dependency>
      `
  },
  {
    name: 'application.properties',
    code: `nad.enable=true`.trim()
  }
];

export const CodePanel = () => {
  return (
    <div className='CodePanel'>
      <MouseFocus>
        {codes.map((props) => (
          <CodeSnip {...props} key={props.name} />
        ))}
      </MouseFocus>
    </div>
  );
};
