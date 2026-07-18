#!/bin/bash

testitem=(AccuracyLayerTest ArgMaxLayerTest BatchNormLayerTest BatchReindexLayerTest BenchmarkTest BiasLayerTest BlobMathTest CommonTest ConcatLayerTest ContrastiveLossLayerTest ConvolutionLayerTest CropLayerTest DataTransformTest DeconvolutionLayerTest DummyDataLayerTest EltwiseLayerTest EmbedLayerTest EuclideanLossLayerTest ConstantFillerTest UniformFillerTest PositiveUnitballFillerTest GaussianFillerTest XavierFillerTest MSRAFillerTest FilterLayerTest FlattenLayerTest SGDSolverTest AdaGradSolverTest NesterovSolverTest AdaDeltaSolverTest AdamSolverTest RMSPropSolverTest HDF5OutputLayerTest HingeLossLayerTest Im2colLayerTest ImageDataLayerTest InfogainLossLayerTest InnerProductLayerTest InternalThreadTest IOTest LayerFactoryTest LRNLayerTest LSTMLayerTest CPUMathFunctionsTest MaxPoolingDropoutTest MemoryDataLayerTest MultinomialLogisticLossLayerTest MVNLayerTest NetTest FilterNetTest NeuronLayerTest PoolingLayerTest PowerLayerTest ProtoTest RandomNumberGeneratorTest ReductionLayerTest ReshapeLayerTest RNNLayerTest ScaleLayerTest SigmoidCrossEntropyLossLayerTest SliceLayerTest SoftmaxLayerTest SoftmaxWithLossLayerTest SolverTest SolverFactoryTest SplitLayerTest SplitLayerInsertionTest SPPLayerTest CPUStochasticPoolingLayerTest SyncedMemoryTest TanHLayerTest ThresholdLayerTest TileLayerTest PaddingLayerUpgradeTest NetUpgradeTest SolverTypeUpgradeTest)

cpu=

if [ "$1" == "armeabi-v7a" ];then
    cpu="armeabi-v7a"
elif [ "$1" == "arm64-v8a" ];then
    cpu="arm64-v8a"
else
    echo "please input ./caffe_test.sh armeabi-v7a  or ./caffe_test.sh arm64-v8a"
    exit 1
fi

for item in ${testitem[@]}
do
    ./$cpu-build/test/test.testbin --gtest_filter=*$item*
done

#GPU相关，原库测试本来就关闭的
#./linuxbuild/test/test.testbin --gtest_filter=*BlobSimpleTest*
#该用例需要加载一个插件，目前不知道是什么插件，Linux上面也会执行失败
#./linuxbuild/test/test.testbin --gtest_filter=*HDF5DataLayerTest*

