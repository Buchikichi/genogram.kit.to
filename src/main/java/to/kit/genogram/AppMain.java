package to.kit.genogram;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;

/**
 * メイン.
 * @author H.Sasai
 */
@SpringBootApplication
@Configuration
public class AppMain {
	/**
	 * メイン.
	 * @param args 引数
	 */
	public static void main(String[] args) {
		SpringApplication.run(AppMain.class, args);
	}
}
