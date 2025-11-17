cmake_minimum_required(VERSION 3.10)
project(FoxyConfidentialAPI)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(Threads REQUIRED)
find_package(Boost COMPONENTS system REQUIRED)

# Include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${Boost_INCLUDE_DIRS}
)

# Add executable
add_executable(foxy-api main.cpp)

# Link libraries
target_link_libraries(foxy-api 
    ${CMAKE_THREAD_LIBS_INIT}
    ${Boost_LIBRARIES}
    jsoncpp
)

# Compiler flags for optimization
if(CMAKE_BUILD_TYPE STREQUAL "Release")
    target_compile_options(foxy-api PRIVATE -O3 -march=native)
endif()

# Set output directory
set_target_properties(foxy-api PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)
