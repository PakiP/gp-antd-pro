import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  message,
  Table,
  Timeline
} from 'antd';

import styles from './AutoMaker.less';

const FormItem = Form.Item;
const { Option } = Select;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@connect(({ automaker, loading }) => ({
  automaker,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    pageNo: 1,
    pageSize: 10
  };

  componentDidMount() {
    const { dispatch, form } = this.props;
    this.timerID = setInterval(
      () => {
        dispatch({
          type: 'automaker/getLatestLog',
          payload: {}
        });
      },
      1500
    );
    dispatch({
      type: 'automaker/getMenuList'
    });
    form.validateFields();
  }

  // renderForm() {
  //   return this.renderAdvancedForm();
  // }
  componentWillUnmount() {
    // const { dispatch } = this.props;
    clearInterval(this.timerID)
  }

  handleSubmit = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const data = {
          city: values.city,
          categoryList: values.categoryList || []
        }
        dispatch({
          type: 'automaker/startCrawler',
          payload: data
        });
      }
    });
  }

  handleStopClick = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'automaker/stopCrawler',
      payload: {}
    });
    console.log('stop!');
  }


  render() {
    const {
      automaker: {
        logList,
        menuList
      },
      form
    } = this.props;
    // const { } = this.state;
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = form;

    const cityError = isFieldTouched('city') && getFieldError('city');
    const categoryListError = isFieldTouched('categoryList') && getFieldError('categoryList');

    function renderTimeLine (arr) {
      const logListArr = arr;
      if (!logListArr) {
        return;
      }
      const {data} = logListArr;
      const listArr = [];
      data.forEach((curr) => {
        listArr.push(<Timeline.Item color={curr.status === 0 ? 'red' : 'green'}>{curr.msg} {moment(+curr.time).format('YYYY-MM-DD HH:mm:ss')}</Timeline.Item>);
      })
      return (
        <Timeline>
          {listArr}
        </Timeline>
      );
    }

    function renderCity () {
      const arr = ['北京', '上海', '杭州', '广州', '深圳', '成都', '武汉', '江苏'];
      const options = [];
      arr.forEach((curr) => {
        options.push(<Option value={curr}>{curr}</Option>)
      })
      return options;
    }

    function renderMenu () {
      // const arr = ['Java', 'C', 'web前端', 'Android', 'HTML5', 'Python', '网络工程师', 'PHP', '数据挖掘', '运维工程师'];
      let arr = []
      arr = menuList.map((curr) => {
        return curr.name;
      })
      const options = [];
      arr.forEach((curr, index, arr) => {
        if (index < 100) {
          options.push(<Option value={curr}>{curr}</Option>)
        }
      })
      return options;
    }

    return (
      <Card title="爬虫控制 (数据来源：拉勾网)">
        <Row>
          <Col span={12}>
            <Card bordered={false}>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <Form.Item
                validateStatus={cityError ? 'error' : ''}
                help={cityError || ''}
              >
                {getFieldDecorator('city', {
                  rules: [{ required: true, message: '请选择城市'}],
                })(
                  <Select placeholder="城市(必选)">
                    {renderCity()}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                validateStatus={categoryListError ? 'error' : ''}
                help={categoryListError || ''}
              >
                {getFieldDecorator('categoryList', {
                  rules: [{ required: false}],
                })(
                  <Select mode="multiple" placeholder="职位类别">
                    {menuList && renderMenu()}
                  </Select>
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  开始爬取
                </Button>
                &nbsp;
                <Button
                  type="danger"
                  onClick={this.handleStopClick}
                >
                  停止
                </Button>
              </Form.Item>
            </Form>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Log">
              {renderTimeLine(logList)}
            </Card>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default TableList;
