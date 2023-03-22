import S from 'fluent-json-schema'

const schema = S.object()
  .prop('hospcode', S.string().minLength(5).maxLength(10).required())
  .prop('hn', S.string().maxLength(50).required())
  .prop('an', S.string().maxLength(50).required())
  .valueOf();

export default schema;