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
  Divider,
  Modal,
  Comment,
  Avatar,
  Tooltip,
  Tag,
  notification
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {salaryArr, workYearArr, companySizeArr, financeStageArr} from '@/config/query';

import styles from './JobDetail.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ jobDetail, loading }) => ({
  jobDetail,
  loading: loading.models.rule,
}))
@Form.create()
class JobDetail extends PureComponent {
  state = {
    expandForm: false,
    loading: false,
    visible: false,
    detail: {}
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'jobDetail/getJobDetail',
      payload: {
        id: location.query.id
      }
    });
  }

  handleUpdateDetail = (id) => {
    const { dispatch, location } = this.props;
    new Promise((resolve) => {
      dispatch({
        type: 'jobDetail/updateJobDetail',
        payload: {
          resolve,
          id
        }
      });
    }).then((res) => {
      if (res.success) {
        notification.success({
          message: '操作成功',
        });
        dispatch({
          type: 'jobDetail/getJobDetail',
          payload: {
            id: location.query.id
          }
        });
      } else {
        notification.error({
          message: '操作失败',
        });
      }
    })
  }


  render() {
    const { jobDetail, history } = this.props;
    const { data } = jobDetail;
    const { visible, loading, detail } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <PageHeaderWrapper title="职位详情">
        <Card bordered={false} title="职位详情" extra={<a href="javascript:;" onClick={() => history.goBack()}>返回</a>}>
          <Form {...formItemLayout}>
            <Form.Item label="id">{data.positionId}</Form.Item>
            <Form.Item label="职位">
              <a href={data.dataLink} target="view_window">{data.name}</a>
            </Form.Item>
            <Form.Item label="薪资">{data.salary}</Form.Item>
            <Form.Item label="城市|地区">{data.city} | {data.area}</Form.Item>
            <Form.Item label="学历">{data.education}</Form.Item>
            <Form.Item label="经验">
              {
                data.workYear &&
                workYearArr.map(curr => {
                  if (curr.value === data.workYear) {
                    return curr.label
                  }
                })
              }
            </Form.Item>
            <Form.Item label="标签">
              { data.industryLables &&
                data.industryLables.map((item) => {
                  return (<Tag color="cyan">{item}</Tag>)
                })
              }
            </Form.Item>
            <Form.Item label="公司">
              <a href={data.companyUrl} target="view_window">{data.companyName}</a>
            </Form.Item>
            <Form.Item label="logo">
              <Avatar shape="square" size={64} src={data.companyLogo} />
            </Form.Item>
            <Form.Item label="地址">{data.isComplete ? data.workAddr : '待更新'}</Form.Item>
            <Form.Item label="融资">
              {
                data.financeStage &&
                financeStageArr.map(curr => {
                  if (curr.value === data.financeStage) {
                    return curr.label
                  }
                })
              }
            </Form.Item>
            <Form.Item label="规模">
              {
                data.companySize &&
                companySizeArr.map(curr => {
                  if (curr.value === data.companySize) {
                    return curr.label
                  }
                })
              }
            </Form.Item>
            <Form.Item label="公司标签">
              { data.industryField &&
                data.industryField.map((item) => {
                  return (<Tag color="cyan">{item}</Tag>)
                })
              }
            </Form.Item>
            <Form.Item label="优势">{data.positionAdvantage}</Form.Item>
            <Form.Item label="创建时间">{moment(+data.createTime).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
            <Form.Item label="更新时间">{moment(+data.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
            <Form.Item label="发布时间">{moment(+data.formatTime).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
            <Form.Item label="状态">{data.status ? '启用中' : '禁用中'}</Form.Item>
            <Form.Item label="详细信息">
              {
                data.isComplete ?
                <div dangerouslySetInnerHTML={{__html: data.jobDetail}}></div>
                : (
                  <Button key="back" type="primary" onClick={() => this.handleUpdateDetail(data._id)}>
                    更新详细信息
                  </Button>
                )
              }
            </Form.Item>
          </Form>
        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default JobDetail;
