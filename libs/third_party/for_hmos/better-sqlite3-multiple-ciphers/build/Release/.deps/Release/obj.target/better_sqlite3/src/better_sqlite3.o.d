cmd_Release/obj.target/better_sqlite3/src/better_sqlite3.o := c++ -o Release/obj.target/better_sqlite3/src/better_sqlite3.o ../src/better_sqlite3.cpp '-DNODE_GYP_MODULE_NAME=better_sqlite3' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-DV8_DEPRECATION_WARNINGS' '-DV8_IMMINENT_DEPRECATION_WARNINGS' '-D_GLIBCXX_USE_CXX11_ABI=1' '-DELECTRON_ENSURE_CONFIG_GYPI' '-D_DARWIN_USE_64_BIT_INODE=1' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-DUSING_ELECTRON_CONFIG_GYPI' '-DV8_COMPRESS_POINTERS' '-DV8_COMPRESS_POINTERS_IN_SHARED_CAGE' '-DV8_ENABLE_SANDBOX' '-DV8_31BIT_SMIS_ON_64BIT_ARCH' '-DOPENSSL_NO_PINSHARED' '-DOPENSSL_THREADS' '-DOPENSSL_NO_ASM' '-DNAPI_VERSION=8' '-DV8_TARGET_OS_OHOS' '-DV8_HAVE_TARGET_OS' '-DBUILDING_NODE_EXTENSION' '-DNDEBUG' -I../node_headers/include/node -I../node_headers/src -I../node_headers/deps/openssl/config -I../node_headers/deps/openssl/openssl/include -I../node_headers/deps/uv/include -I../node_headers/deps/zlib -I../node_headers/deps/v8/include -I./Release/obj/gen/sqlite3  -O3 -mmacosx-version-min=10.7 -arch arm64 -Wall -Wendif-labels -W -Wno-unused-parameter -std=gnu++17 -stdlib=libc++ -fno-rtti -fno-exceptions -fvisibility-inlines-hidden -std=c++20 -stdlib=libc++ -MMD -MF ./Release/.deps/Release/obj.target/better_sqlite3/src/better_sqlite3.o.d.raw -I/opt/homebrew/opt/ruby/include  -c
Release/obj.target/better_sqlite3/src/better_sqlite3.o: \
  ../src/better_sqlite3.cpp Release/obj/gen/sqlite3/sqlite3.h \
  ../node_headers/include/node/node.h ../node_headers/include/node/v8.h \
  ../node_headers/include/node/cppgc/common.h \
  ../node_headers/include/node/v8config.h \
  ../node_headers/include/node/v8-array-buffer.h \
  ../node_headers/include/node/v8-local-handle.h \
  ../node_headers/include/node/v8-handle-base.h \
  ../node_headers/include/node/v8-internal.h \
  ../node_headers/include/node/v8-memory-span.h \
  ../node_headers/include/node/v8-object.h \
  ../node_headers/include/node/v8-maybe.h \
  ../node_headers/include/node/v8-persistent-handle.h \
  ../node_headers/include/node/v8-weak-callback-info.h \
  ../node_headers/include/node/v8-primitive.h \
  ../node_headers/include/node/v8-data.h \
  ../node_headers/include/node/v8-value.h \
  ../node_headers/include/node/v8-sandbox.h \
  ../node_headers/include/node/v8-traced-handle.h \
  ../node_headers/include/node/v8-container.h \
  ../node_headers/include/node/v8-context.h \
  ../node_headers/include/node/v8-snapshot.h \
  ../node_headers/include/node/v8-isolate.h \
  ../node_headers/include/node/v8-callbacks.h \
  ../node_headers/include/node/v8-promise.h \
  ../node_headers/include/node/v8-debug.h \
  ../node_headers/include/node/v8-script.h \
  ../node_headers/include/node/v8-message.h \
  ../node_headers/include/node/v8-embedder-heap.h \
  ../node_headers/include/node/v8-exception.h \
  ../node_headers/include/node/v8-function-callback.h \
  ../node_headers/include/node/v8-microtask.h \
  ../node_headers/include/node/v8-statistics.h \
  ../node_headers/include/node/v8-unwinder.h \
  ../node_headers/include/node/v8-embedder-state-scope.h \
  ../node_headers/include/node/v8-date.h \
  ../node_headers/include/node/v8-extension.h \
  ../node_headers/include/node/v8-external.h \
  ../node_headers/include/node/v8-function.h \
  ../node_headers/include/node/v8-template.h \
  ../node_headers/include/node/v8-initialization.h \
  ../node_headers/include/node/v8-platform.h \
  ../node_headers/include/node/v8-source-location.h \
  ../node_headers/include/node/v8-json.h \
  ../node_headers/include/node/v8-locker.h \
  ../node_headers/include/node/v8-microtask-queue.h \
  ../node_headers/include/node/v8-primitive-object.h \
  ../node_headers/include/node/v8-proxy.h \
  ../node_headers/include/node/v8-regexp.h \
  ../node_headers/include/node/v8-typed-array.h \
  ../node_headers/include/node/v8-value-serializer.h \
  ../node_headers/include/node/v8-version.h \
  ../node_headers/include/node/v8-wasm.h \
  ../node_headers/include/node/node_version.h \
  ../node_headers/include/node/node_api.h \
  ../node_headers/include/node/js_native_api.h \
  ../node_headers/include/node/js_native_api_types.h \
  ../node_headers/include/node/node_api_types.h \
  ../node_headers/include/node/node_object_wrap.h \
  ../node_headers/include/node/node_buffer.h ../src/util/macros.cpp \
  ../src/util/helpers.cpp ../src/util/constants.cpp \
  ../src/util/bind-map.cpp ../src/util/data-converter.cpp \
  ../src/util/data.cpp ../src/util/row-builder.cpp \
  ../src/objects/backup.hpp ../src/objects/statement.hpp \
  ../src/objects/database.hpp ../src/addon.cpp \
  ../src/objects/statement-iterator.hpp ../src/util/query-macros.cpp \
  ../src/util/custom-function.cpp ../src/util/custom-aggregate.cpp \
  ../src/util/custom-table.cpp ../src/util/binder.cpp \
  ../src/objects/backup.cpp ../src/objects/statement.cpp \
  ../src/objects/database.cpp ../src/objects/statement-iterator.cpp
../src/better_sqlite3.cpp:
Release/obj/gen/sqlite3/sqlite3.h:
../node_headers/include/node/node.h:
../node_headers/include/node/v8.h:
../node_headers/include/node/cppgc/common.h:
../node_headers/include/node/v8config.h:
../node_headers/include/node/v8-array-buffer.h:
../node_headers/include/node/v8-local-handle.h:
../node_headers/include/node/v8-handle-base.h:
../node_headers/include/node/v8-internal.h:
../node_headers/include/node/v8-memory-span.h:
../node_headers/include/node/v8-object.h:
../node_headers/include/node/v8-maybe.h:
../node_headers/include/node/v8-persistent-handle.h:
../node_headers/include/node/v8-weak-callback-info.h:
../node_headers/include/node/v8-primitive.h:
../node_headers/include/node/v8-data.h:
../node_headers/include/node/v8-value.h:
../node_headers/include/node/v8-sandbox.h:
../node_headers/include/node/v8-traced-handle.h:
../node_headers/include/node/v8-container.h:
../node_headers/include/node/v8-context.h:
../node_headers/include/node/v8-snapshot.h:
../node_headers/include/node/v8-isolate.h:
../node_headers/include/node/v8-callbacks.h:
../node_headers/include/node/v8-promise.h:
../node_headers/include/node/v8-debug.h:
../node_headers/include/node/v8-script.h:
../node_headers/include/node/v8-message.h:
../node_headers/include/node/v8-embedder-heap.h:
../node_headers/include/node/v8-exception.h:
../node_headers/include/node/v8-function-callback.h:
../node_headers/include/node/v8-microtask.h:
../node_headers/include/node/v8-statistics.h:
../node_headers/include/node/v8-unwinder.h:
../node_headers/include/node/v8-embedder-state-scope.h:
../node_headers/include/node/v8-date.h:
../node_headers/include/node/v8-extension.h:
../node_headers/include/node/v8-external.h:
../node_headers/include/node/v8-function.h:
../node_headers/include/node/v8-template.h:
../node_headers/include/node/v8-initialization.h:
../node_headers/include/node/v8-platform.h:
../node_headers/include/node/v8-source-location.h:
../node_headers/include/node/v8-json.h:
../node_headers/include/node/v8-locker.h:
../node_headers/include/node/v8-microtask-queue.h:
../node_headers/include/node/v8-primitive-object.h:
../node_headers/include/node/v8-proxy.h:
../node_headers/include/node/v8-regexp.h:
../node_headers/include/node/v8-typed-array.h:
../node_headers/include/node/v8-value-serializer.h:
../node_headers/include/node/v8-version.h:
../node_headers/include/node/v8-wasm.h:
../node_headers/include/node/node_version.h:
../node_headers/include/node/node_api.h:
../node_headers/include/node/js_native_api.h:
../node_headers/include/node/js_native_api_types.h:
../node_headers/include/node/node_api_types.h:
../node_headers/include/node/node_object_wrap.h:
../node_headers/include/node/node_buffer.h:
../src/util/macros.cpp:
../src/util/helpers.cpp:
../src/util/constants.cpp:
../src/util/bind-map.cpp:
../src/util/data-converter.cpp:
../src/util/data.cpp:
../src/util/row-builder.cpp:
../src/objects/backup.hpp:
../src/objects/statement.hpp:
../src/objects/database.hpp:
../src/addon.cpp:
../src/objects/statement-iterator.hpp:
../src/util/query-macros.cpp:
../src/util/custom-function.cpp:
../src/util/custom-aggregate.cpp:
../src/util/custom-table.cpp:
../src/util/binder.cpp:
../src/objects/backup.cpp:
../src/objects/statement.cpp:
../src/objects/database.cpp:
../src/objects/statement-iterator.cpp:
