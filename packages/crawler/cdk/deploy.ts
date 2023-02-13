import { App, Duration, Stack, StackProps } from 'aws-cdk-lib'
import { DockerImageCode, DockerImageFunction } from 'aws-cdk-lib/aws-lambda'
import { Repository } from 'aws-cdk-lib/aws-ecr'
import {
  addLambdaPermission,
  LambdaFunction,
} from 'aws-cdk-lib/aws-events-targets'
import { Rule, Schedule } from 'aws-cdk-lib/aws-events'

class WasGeitCrawlerStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const repo = Repository.fromRepositoryArn(
      this,
      'wasgeit-crawler-repo',
      'arn:aws:ecr:eu-central-1:067015433675:067015433675.dkr.ecr.eu-central-1.amazonaws.com/wasgeit-crawler'
    )

    const fn = new DockerImageFunction(this, 'wasgeit-crawler-fn', {
      code: DockerImageCode.fromEcr(repo, { tagOrDigest: 'production' }),
      timeout: Duration.minutes(3),
      memorySize: 128,
      retryAttempts: 0,
    })

    const rule = new Rule(this, 'wasgeit-crawler-cron-rule', {
      schedule: Schedule.cron({
        year: '*',
        hour: '3',
        minute: '0',
        day: '*',
        month: '*',
      }),
    })

    rule.addTarget(new LambdaFunction(fn))
    addLambdaPermission(rule, fn)
  }
}

const app = new App()
new WasGeitCrawlerStack(app, 'wasgeit-production')
