# xySpring 项目运行说明

## 运行方式

由于这是一个 Spring Boot Maven 项目，不能直接使用 `javac` 命令编译单个文件。请使用以下方式运行：

### 方法 1：使用 VS Code Java 插件（推荐）

1. 打开 `src/main/java/com/matehub/xyspring/XySpringApplication.java` 文件。
2. 等待 Java 插件加载（左下角状态栏显示 Ready）。
3. 在代码编辑器中，找到 `public class XySpringApplication` 上方的 **Run | Debug** 按钮（Code Lens）。
4. 点击 **Run** 即可启动项目。

### 方法 2：使用 Spring Boot Dashboard

1. 点击 VS Code 左侧边栏的 **Spring Boot Dashboard** 图标（如果已安装）。
2. 在列表中找到 `xySpring`，点击播放按钮启动。

### 方法 3：使用 Maven 命令行

如果你已安装 Maven 并配置了环境变量：

1. 打开终端。
2. 进入项目目录：`cd f:\CodeAritist\CasualTalksOfTheLeisurely\SpringBoot\xySpring`
3. 运行命令：`mvn spring-boot:run`

## 注意事项

- 请确保本地 MySQL 数据库已启动。
- 数据库连接配置在 `src/main/resources/application.yml` 中。
