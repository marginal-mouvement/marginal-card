export interface Serializer<In, Out = {}> {
  serialize(input: In): Out;
  deserialize(input: Out): In;
}
