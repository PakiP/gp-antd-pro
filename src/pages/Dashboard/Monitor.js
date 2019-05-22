import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Row, Col, Card, Tooltip, Icon, Statistic } from 'antd';
import { Pie, WaterWave, Gauge, TagCloud, ChartCard, yuan, MiniBar, Field } from '@/components/Charts';
import NumberInfo from '@/components/NumberInfo';
import CountDown from '@/components/CountDown';
import ActiveChart from '@/components/ActiveChart';
import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import styles from './Monitor.less';
import moment from 'moment';

const { Secured } = Authorized;

const targetTime = new Date().getTime() + 3900000;

// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 300);
});

@Secured(havePermissionAsync)
@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
}))
class Monitor extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/getJobAndUserNum',
    }).then(() => {
      dispatch({
        type: 'monitor/fetchTags',
      });
      dispatch({
        type: 'monitor/getCategoryGroup',
      });
      dispatch({
        type: 'monitor/getCrawlerStatus',
      });
    });
  }

  render() {
    const { monitor, loading } = this.props;
    const { tags, jobAndUserNum, categoryGroup, crawlerStatus } = monitor;
    let jobNum = 0;
    let userNum = 0;
    let requsetNum = 0;
    let currDayrequsetNum = 0;
    jobNum = jobAndUserNum && jobAndUserNum.totalJob;
    userNum = jobAndUserNum && jobAndUserNum.totalUser;
    requsetNum = jobAndUserNum && jobAndUserNum.totalRequset;
    currDayrequsetNum = jobAndUserNum && jobAndUserNum.currDayRequset;
    let top1 = {name:' ', value: 0};
    let top2 = {name:' ', value: 0};
    let top3 = {name:' ', value: 0};
    const currCrawlerStatus = crawlerStatus && crawlerStatus[0].status;
    // const tags = [];
    // for (let i = 0; i < 50; i += 1) {
    //   tags.push({
    //     name: `TagClout-Title-${i}`,
    //     value: Math.floor(Math.random() * 50) + 20,
    //   });
    // }
    const visitData = [];
    const beginDay = new Date().getTime();
    for (let i = 0; i < 7; i += 1) {
      visitData.push({
        x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
        y: Math.floor(Math.random() * 100) + 10,
      });
    }
    let salesPieData = [{
      x: 'java',
      y: 100,
    }]
    if (categoryGroup && categoryGroup.length) {
      categoryGroup.forEach((item) => {
        item['x'] = item['_id'];
        item['y'] = item['value'];
      });
      top1 = {
        name: categoryGroup[0]['_id'],
        value: Math.round(categoryGroup[0]['value'] / jobNum * 100),
      }
      top2 = {
        name: categoryGroup[1]['_id'],
        value: Math.round(categoryGroup[1]['value'] / jobNum * 100),
      }
      top3 = {
        name: categoryGroup[2]['_id'],
        value: Math.round(categoryGroup[2]['value'] / jobNum * 100),
      }
      salesPieData = categoryGroup
    }
    return (
      <GridContent>
        <Row gutter={24}>
          <Col xl={12} lg={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title='职位数量前三'
              bordered={false}
              className={styles.pieCard}
            >
              <Row style={{ padding: '16px 0' }}>
                <Col span={8}>
                  <Pie
                    animate={false}
                    percent={top1.value}
                    subTitle={top1.name}
                    total={`${top1.value}%`}
                    height={128}
                    lineWidth={2}
                  />
                </Col>
                <Col span={8}>
                  <Pie
                    animate={false}
                    color="#5DDECF"
                    percent={top2.value}
                    subTitle={top2.name}
                    total={`${top2.value}%`}
                    height={128}
                    lineWidth={2}
                  />
                </Col>
                <Col span={8}>
                  <Pie
                    animate={false}
                    color="#2FC25B"
                    percent={top3.value}
                    subTitle={top3.name}
                    total={`${top3.value}%`}
                    height={128}
                    lineWidth={2}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="职位总数"
              avatar={
                <img
                  alt="indicator"
                  style={{ width: 56, height: 56 }}
                  src={require("@/assets/jobs.png")}
                />
              }
              contentHeight={146}
              action={
                <Tooltip title="职位总数">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <span dangerouslySetInnerHTML={{ __html: jobNum }} />}
            />
            <ChartCard
              title="用户总数"
              style={{marginTop: 52}}
              avatar={
                <img
                  alt="indicator"
                  style={{ width: 56, height: 56 }}
                  src={require("@/assets/users.png")}
                />
              }
              action={
                <Tooltip title="用户总数">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <span dangerouslySetInnerHTML={{ __html: userNum }} />}
            />
          </Col>
          <Col xl={6} lg={12} sm={24} xs={24} style={{ marginBottom: 24}}>
            <ChartCard
              title="访问量"
              style={{paddingTop: 40, paddingBottom: 40}}
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(requsetNum).format('0,0')}
              footer={<Field label="日访问量" value={currDayrequsetNum} />}
              contentHeight={46}
            >
              <MiniBar height={46} data={visitData} />
            </ChartCard>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card
              title='职位分类'
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
              <Pie
                total={() => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: salesPieData.reduce((pre, now) => now.y + pre, 0),
                    }}
                  />
                )}
                data={salesPieData}
                valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val }} />}
                height={180}
              />
            </Card>
            <Card
              title="爬虫运行状态"
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              <Statistic
                title={currCrawlerStatus ? "Active": "Stop"}
                value={currCrawlerStatus ? "运行中": "停止中"}
                precision={2}
                valueStyle={{ color: currCrawlerStatus ? '#3f8600' : '#cf1322'}}
                prefix={<Icon type={currCrawlerStatus ? "play-circle" : "stop"} />}
                suffix=""
              />
            </Card>
          </Col>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title="职位标签统计"
              loading={loading}
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={tags} height={368} weight={4} padding={10}/>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Monitor;
