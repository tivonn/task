'use strict'

module.exports = app => {
  const { router, controller } = app
  const statisticsRouter = router.namespace('/api/statistics')
  statisticsRouter.get('/all', controller.statistics.all)
  // statisticsRouter.get('/period', controller.statistics.period)
}
