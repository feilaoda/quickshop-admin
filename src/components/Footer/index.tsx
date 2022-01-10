import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'QuickPaaS',
    defaultMessage: 'QuickPaaS',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'QuickShop',
          title: 'QuickShop',
          href: 'https://www.quickpaas',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
